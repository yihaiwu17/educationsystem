export class Storage {
  key = 'cmsUser';

  get userInfo() {
    try { 
      return JSON.parse(localStorage.getItem(this.key));
      
    } catch (error) {
      return null;
    }
  }

  get token() {
    return this.userInfo.data.token;
  }

  get userType() {

    return this.userInfo?.data.role;
  }
}

export const storage = new Storage();

export default storage;
