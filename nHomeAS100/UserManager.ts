/// <reference path="../../DefinitelyTyped/node/node.d.ts" />

export module UserManager{

    export class User{
        private _userId: string;
        private _firstName: string;
        private _lastName: string;

        constructor(userid: string, password: string, firstName: string, lastName: string) {
            this._userId = userid;
        }

        public getUserId(): string {
            return this._userId;
        }

        public getFirstName(): string {
            return this._userId;
        }

        public getLastName(): string {
            return this._lastName;
        }

        public static getUserById(userid: string): User{
            return null;
        }
    }

    export class LoginManager{
        public loginUser(userId: string, password: string):boolean {
            return false;
        }
    }
}