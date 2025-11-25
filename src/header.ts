class Header {
  private readonly contentType: string = 'application/json';

  private readonly authorization!: string;

  constructor(token?: string, contentType?: string) {
    if (token) {
      this.authorization = token;
    }
    if (contentType) {
      this.contentType = contentType;
    }
  }

  getHeader() {
    if (this.authorization) {
      return {
        'content-type': this.contentType,
        Authorization: `Bearer ${this.authorization}`,
      };
    }
    return { 'content-type': this.contentType };
  }
}

export default Header;
