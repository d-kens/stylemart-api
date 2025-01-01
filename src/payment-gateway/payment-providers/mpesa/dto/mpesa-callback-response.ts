export class MpesaCallbackResponse {
    ResultCode: string;
    ResultDesc: string;
    constructor(ResultCode: string, ResultDesc: string) {
      this.ResultCode = ResultCode;
      this.ResultDesc = ResultDesc;
    }
}
  