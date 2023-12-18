export class ErrorResponse {
  /**
   * the error message
   * @example 'duplicate key value violates unique constraint'
   */
  message: string;
  /**
   * the endpoint that caused the error
   * @example 'GET /example'
   */
  // todo: display the exact request for each entity's props in @example
  // i.e. for POST /users, display `POST /users`
  request?: string;

  /**
   * the error code
   * @example 'DB_ERR'
   */
  code?: string;
}
