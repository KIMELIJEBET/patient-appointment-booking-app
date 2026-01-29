class AuthController < ApplicationController
  def signup
    user = User.new(user_params)
    if user.save
      token = encode_token({ user_id: user.id })
      render json: { user: user, token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      token = encode_token({ user_id: user.id })
      render json: { user: user, token: token }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end
def logout
    # For JWT, logout is typically handled on the client side by deleting the token.
    # Here, we can just respond with a message.
    render json: { message: "Logged out successfully" }, status: :ok
end
  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
