import { MenusOrderingResponseContent } from "./menus-ordering-response-content";

export class MenusOrderingResponse {

    statusCode!: number;
  message!: string;
//   result!:state[]

  responseContent!: MenusOrderingResponseContent[]
}
