<?php
namespace Coxo\Pickup;
class Api {
    private string $token;
    private bool $dev;

    public function __construct($mode) {
        $this->token="4BCBD0CC-F240-4E1F-8821-9BEDB5BBCD95";
        if ($mode==='dev') {
            $this->dev=true;
        } else {
            $this->dev=false;
        }
    }

    static function getShop($shopCode) {
        $res=ShopTable::getList([
            'filter'=>[
                'CODE'=>$shopCode
            ]
        ])->fetch();
        if ($res) return $res;
        $fields=[
            'CODE'=>$shopCode
        ];
        $result=ShopTable::add($fields);
        if ($result->isSuccess())
        {
            $shop=ShopTable::getById($result->getId())->fetch();
            if ($shop) return $shop;
        } else {
            return false;
        }
    }
    public function getShipment($q) {
        return ShipmentTable::getList(
            [
                'filter'=>
                [
                    'LOGIC'=>'OR',
                    'DELIVER_ID'=>$q,
                    'ORDER_CODE'=>$q
                ]
            ]
        )->fetch();
    }



    public function getOrders(): bool
    {
        $d1=date('Y-m-d', strtotime('yesterday')).'T00:00:00Z';
        $d2=date('Y-m-d', strtotime('yesterday')).'T23:59:59Z';
        $params=[
            "meta"=>[],
            "data" => [
                "token"=> $this->token,
                "dateFrom"=>$d1,
                "dateTo"=>$d2,
            ]
        ];
        $url='https://api.megamarket.tech/api/market/v1/orderService/order/search';
        $res=$this->query($url, $params);
        if (isset($res->success) && $res->success===1) {
            if (isset($res->data->shipments) && !empty($res->data->shipments)) {
                $url='https://api.megamarket.tech/api/market/v1/orderService/order/get';
                $params=[
                    "meta"=>[],
                    "data" => [
                        "token"=> $this->token,
                        "shipments"=> $res->data->shipments
                    ]
                ];
                $res = $this->query($url, $params);
                if (isset($res->data->shipments) && !empty($res->data->shipments)) {
                    foreach ($res->data->shipments as $shipment) {
                        $t=\DateTime::createFromFormat(DATE_ATOM, $shipment->creationDate)->getTimestamp();
                        $shop=self::getShop($shipment->shippingPoint);
                        $fields=[
                            'SHIPMENT_ID'=>$shipment->shipmentId,
                            'CREATE_TIMESTAMP'=>$t,
                            'ORDER_CODE'=>$shipment->orderCode,
                            'SHOP_CODE'=>$shop['ID'],
                            'STATUS'=>$shipment->status,

                        ];
                        $shipmentAr=ShipmentTable::getList([
                            'filter'=>[
                                'SHIPMENT_ID'=>$shipment->shipmentId
                            ]
                        ])->fetch();
                        if ($shipmentAr) {

                            ShipmentTable::update($shipmentAr['ID'], $fields);
                        } else {
                            $fields['ERRORS_REPORTED']='N';
                            $fields['VALIDATE_BY_CODE']='N';
                            ShipmentTable::add($fields);
                        }
                    }
                }
            }
        }
        return false;
    }
    public function addItem ($shipmentId, $item): void
    {
        $filter=[
            'SHIPMENT_ID'=>$shipmentId,
            'OFFER_ID'=>$item->offerId,
            'GOODS_ID'=>$item->goodsId,
            'ITEM_INDEX'=>$item->itemIndex
        ];
        $newItem=ItemTable::getList([
            'filter'=>$filter,
            'select'=>['ID']
        ])->fetch();
        $fields=[
            'NAME'=>$item->goodsData->name,
            'PRICE'=>$item->price,
            'FINAL_PRICE'=>$item->finalPrice,
            'QUANTITY'=>$item->quantity,
        ];

        if ($newItem) {
            ItemTable::update($newItem['ID'], $fields);
        } else {
            ItemTable::add(array_merge($fields, $filter));
        }

    }
    public function updateShipments() {


        $last=ShipmentTable::getList(
            [
                'filter'=>[
                    [
                        'LOGIC'=>'OR',
                        ['STATUS'=>'NEW'],
                        ['STATUS'=>'PENDING'],
                        ['STATUS'=>'PENDING_CONFIRMATION'],
                        ['STATUS'=>'CONFIRMED'],
                        ['STATUS'=>'PENDING_PACKING'],
                        ['STATUS'=>'PACKED'],
                        ['STATUS'=>'PENDING_SHIPPING'],
                        ['STATUS'=>'SHIPPED'],
                    ]


                ],
                'select'=>[
                    'SHIPMENT_ID', 'ID'
                ],
                'limit'=>400
            ]
        );
        $arLast=[];
        while ($l=$last->fetch()) {
            $arLast[]=$l['SHIPMENT_ID'];
        }
        if (!empty($arLast)) {
            $url = 'https://api.megamarket.tech/api/market/v1/orderService/order/get';
            $params = [
                "meta" => [],
                "data" => [
                    "token" => $this->token,
                    "shipments" => $arLast
                ]
            ];
            $res = $this->query($url, $params);
            if (isset($res->data->shipments) && !empty($res->data->shipments)) {
                foreach ($res->data->shipments as $shipment) {
                    $price = 0;
                    $finalPrice = 0;
                    foreach ($shipment->items as $item) {
                        self::addItem($shipment->shipmentId, $item);
                        $price = $price + ($item->price * $item->quantity);
                        $finalPrice = $finalPrice + ($item->finalPrice * $item->quantity);
                    }
                    $lastT = false;
                    if (!empty($shipment->items[0]->events)) {

                        $key = (count($shipment->items[0]->events) - 1);
                        $lastT = $shipment->items[0]->events[$key]->eventDate;

                    }
                    $t = \DateTime::createFromFormat(DATE_ATOM, $shipment->creationDate)->getTimestamp();
                    $shop = self::getShop($shipment->shippingPoint);
                    $fields = [
                        'SHIPMENT_ID' => $shipment->shipmentId,
                        'CREATE_TIMESTAMP' => \DateTime::createFromFormat(DATE_ATOM, $shipment->creationDate)->getTimestamp(),
                        'ORDER_CODE' => $shipment->orderCode,
                        'STATUS' => $shipment->status,
                        'DELIVER_ID' => $shipment->deliveryId,
                        'USER_PHONE' => $shipment->customer->phone,
                        'PRICE' => $price,
                        'FINAL_PRICE' => $finalPrice
                    ];
                    if ($lastT) {
                        $fields['LAST_MODIFIED'] = \DateTime::createFromFormat(DATE_ATOM, $lastT)->getTimestamp();
                    }
                    if ($shop) {
                        $fields['SHOP_CODE'] = $shop['ID'];
                    }

                    $shipmentAr = ShipmentTable::getList([
                        'filter' => [
                            'SHIPMENT_ID' => $shipment->shipmentId
                        ]
                    ])->fetch();
                    if ($shipmentAr) {
                        ShipmentTable::update($shipmentAr['ID'], $fields);
                    } else {
                        $fields['ERRORS_REPORTED'] = 'N';
                        $fields['VALIDATE_BY_CODE'] = 'N';
                        ShipmentTable::add($fields);
                    }
                }
            }
        }

    }

    public function getAllShipments() {

        $last=ShipmentTable::getList(
            [
             'order'=>[
                 'CREATE_TIMESTAMP'=>'desc'
                 ],
            'select'=>[
                'CREATE_TIMESTAMP'
            ]
            ]
        )->fetch();
          $d1=false;
          $d2=false;
//        $period=time()-(86400*14);
//        $d1=date('Y-m-d', $period).'T00:00:00Z';
//        $d2=date('Y-m-d', $period).'T23:59:59Z';
//        echo $d1. ' - '.$d2;
        $period=$last['CREATE_TIMESTAMP']-7200;
        $d1=date('Y-m-d\TH:i:s\Z', $period);
        $searchParams=[
            "token"=> $this->token,
        ];
        if ($d1) $searchParams['dateFrom'] = $d1;
        if ($d2) $searchParams['dateTo'] = $d2;
        $params=[
            "meta"=>[],
            "data" => $searchParams
        ];
        $url='https://api.megamarket.tech/api/market/v1/orderService/order/search';
        $res=$this->query($url, $params);
        if (isset($res->success) && $res->success===1) {
            if (isset($res->data->shipments) && !empty($res->data->shipments)) {
                $url='https://api.megamarket.tech/api/market/v1/orderService/order/get';
                $params=[
                    "meta"=>[],
                    "data" => [
                        "token"=> $this->token,
                        "shipments"=> $res->data->shipments
                    ]
                ];
                $res = $this->query($url, $params);
                if (isset($res->data->shipments) && !empty($res->data->shipments)) {
                    foreach ($res->data->shipments as $shipment) {
                        $lastT=false;
                        if (!empty($shipment->items[0]->events)) {

                            $key = (count($shipment->items[0]->events) - 1);
                            $lastT=$shipment->items[0]->events[$key]->eventDate;

                        }
                        $t=\DateTime::createFromFormat(DATE_ATOM, $shipment->creationDate)->getTimestamp();
                        $shop=self::getShop($shipment->shippingPoint);
                        $fields=[
                            'SHIPMENT_ID'=>$shipment->shipmentId,
                            'CREATE_TIMESTAMP'=>\DateTime::createFromFormat(DATE_ATOM, $shipment->creationDate)->getTimestamp(),
                            'ORDER_CODE'=>$shipment->orderCode,
                            'STATUS'=>$shipment->status,
                            'DELIVER_ID'=>$shipment->deliveryId
                        ];
                        if ($lastT) {
                            $fields['LAST_MODIFIED']=\DateTime::createFromFormat(DATE_ATOM, $lastT)->getTimestamp();
                        }
                        if ($shop) {
                            $fields['SHOP_CODE']=$shop['ID'];
                        }

                        $shipmentAr=ShipmentTable::getList([
                            'filter'=>[
                                'SHIPMENT_ID'=>$shipment->shipmentId
                            ]
                        ])->fetch();
                        if ($shipmentAr) {
                            ShipmentTable::update($shipmentAr['ID'], $fields);
                        } else {
                            $fields['ERRORS_REPORTED']='N';
                            $fields['VALIDATE_BY_CODE']='N';
                            ShipmentTable::add($fields);
                        }
                    }
                }
            }
        }
    }

    public function checkOrders() {
        //$this->getOrders();
        $shipments=ShipmentTable::getList(
            [
                'filter'=>[
                    'STATUS'=>'DELIVERED',
                    'ERRORS_REPORTED'=>'N',
                    'VALIDATE_BY_CODE'=>'N'
                ],
                'select'=>[
                    'SHIPMENT_ID',
                    'SHOP'=>'SHOP'
                ]
            ]
        );
        $rsStore = \Bitrix\Catalog\StoreTable::getList(array(
            'filter' => array('ACTIVE'>='Y'),

        ));
        $arStores=[];
        while($arStore=$rsStore->fetch())
        {
            $arStores[$arStore['ID']]=$arStore;
        }
        $arShipments=[];
        while ($shipment=$shipments->fetchObject()) {
            $arShipments[$shipment->get('SHOP')->getBitrixId()][]=$shipment->get('SHIPMENT_ID');
            $shipment->set('ERRORS_REPORTED','Y');
            $shipment->save();
        }
        if (!empty($arShipments)) {
            $message = "Выданные посылки Мегамаркета без подтверждения кодом:  \n\r ";

            foreach ($arShipments as $shop => $shipments) {
                $message .= "\n\r".$arStores[$shop]['TITLE'] . ": \n\r";
                                foreach ($shipments as $shipment) {
                    $message .= $shipment."\n\r";
                }
            }
            echo '<pre>';
            print_r($message);
            echo '</pre>';
            $httpClient = new \Bitrix\Main\Web\HttpClient();
            $res=$httpClient->post("https://portal.coxo.ru/rest/3910/ec1z6gee4xc6oaac/im.message.add.json", [
                "DIALOG_ID" => 'chat153537',
                "MESSAGE" => $message,


            ]);
        }
    }

    private function query($url, $params) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
            array(
                "Content-Type: application/json; charset=UTF-8",
            ));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( $params ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $jsResponse = curl_exec($ch);
        $requestCode=curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        if (empty($jsResponse)) {
            $result =  (object) array();
        } else {
            $result= json_decode($jsResponse);
        }
        $result->http_code=$requestCode;
        return $result;
    }
    public function getOrder($orderId) {
        $url='https://api.megamarket.tech/api/market/v1/orderService/order/get';

        $params=[
            "meta"=>[],
            "data" => [
                "token"=> $this->token,
                "shipments"=> [$orderId]
                ]

        ];
        return $this->query($url, $params);
    }
}