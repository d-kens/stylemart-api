export class MpesaResponse {
    Body: Body;
  }
  class CallbackMetadataItem {
    Name: string;
    Value: string | number;
  }
  
  class CallbackMetadata {
    Item: CallbackMetadataItem[];
  }
  
  class StkCallback {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: number;
    ResultDesc: string;
    CallbackMetadata: CallbackMetadata;
  }
  
  class Body {
    stkCallback: StkCallback;
  }
  