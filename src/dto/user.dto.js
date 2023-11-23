class UserDto{
    constructor(user){
        this._id = user._id
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.date_of_birth = user.date_of_birth
        this.email = user.email
        this.password = user.password
        this.cart = user.cart
        this.role = user.role
        this.last_connection = user.last_connection
        this.documents = user.documents
    }
}

export default UserDto