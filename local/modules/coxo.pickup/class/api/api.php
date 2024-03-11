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
            $shop=ShopTable::getById($result->getId());
            if ($shop) return $shop;
        } else {
            return false;
        }
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
                    'SHOP'=>'SHOP'
                ]
            ]
        );
        while ($shipment=$shipments->fetchObject()) {
            echo '<pre>';
            print_r($shipment->get('SHOP')->getBitrixId());
            echo '</pre>';
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