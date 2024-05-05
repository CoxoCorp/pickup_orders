<?php
require "../header.php";
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
$orderId=trim($request->get('orderId'));
Bitrix\Main\Loader::includeModule('coxo.pickup');
$api = new Coxo\Pickup\Api("coxo");
$shipment=$api->getShipment($orderId);
if (!$shipment) {
    $api->getAllShipments();
    $shipment=$api->getShipment($orderId);
}
if ($shipment) {
    $data = $api->getOrder($shipment['SHIPMENT_ID']);
    $chatId = false;
    if ($data->success === 1) {
        if (isset($data->data->shipments[0]->customer->phone)) {
            $data->data->shipments[0]->customer->phone='79062302755';
            //$data->data->shipments[0]->customer->phone='79622666654';
            require($_SERVER["DOCUMENT_ROOT"] . "/customClasses/TelegramUser.php");
            require($_SERVER["DOCUMENT_ROOT"] . "/customClasses/CustomUser.php");
            $phone = CustomUser::GetPhone($data->data->shipments[0]->customer->phone);
            $user = CustomUser::GetCurrentUserForPhone($phone);
            if ($user) {
                $userId = $user['ID'];
                $chatId = TelegramUser::GetChatUserID($userId);
            }

        }
    }
    $res = [
        'status' => 'ok',
        'data' => [
            'orderId' => $orderId,
            'res' => $data,
        ]
    ];
    if ($chatId) {
        $res['data']['chatId'] = $chatId;
    }
} else {
    $res=[
        'status'=>'error',
        'error'=>[
            'message'=>'Не найдена доставка с таким номером'
        ]
    ];
}

echo json_encode($res, JSON_NUMERIC_CHECK);