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
        if ($this->dev) {
            $url='https://api.megamarket.tech/api/market/v1/orderService/order/get';
        } else {
            $url='https://api-test.megamarket.tech/api/market/v1/orderService/order/get';
        }
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