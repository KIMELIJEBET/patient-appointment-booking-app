class Api::AdminController < Api::ApplicationController
  before_action :authorize_request
  before_action :admin_only

  def dashboard
    render json: {
      total_users: User.count,
      total_appointments: Appointment.count,
      total_admins: User.where(role: 'admin').count,
      total_regular_users: User.where(role: 'user').count,
    }, status: :ok
  end

  def users
    @users = User.all
    render json: @users, status: :ok
  end

  def user_details
    @user = User.find(params[:id])
    render json: {
      user: @user,
      appointments_count: @user.appointments.count,
      appointments: @user.appointments
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'User not found' }, status: :not_found
  end

  def delete_user
    @user = User.find(params[:id])
    
    if @user.id == current_user.id
      render json: { message: 'Cannot delete your own account' }, status: :unprocessable_entity
      return
    end

    if @user.destroy
      render json: { message: 'User deleted successfully' }, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'User not found' }, status: :not_found
  end

  def all_appointments
    @appointments = Appointment.includes(:user).all
    render json: @appointments.map { |apt|
      apt.attributes.merge(user_name: apt.user.name, user_email: apt.user.email)
    }, status: :ok
  end

  def delete_appointment
    @appointment = Appointment.find(params[:id])
    
    if @appointment.destroy
      render json: { message: 'Appointment deleted successfully' }, status: :ok
    else
      render json: { errors: @appointment.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'Appointment not found' }, status: :not_found
  end

  def promote_user
    @user = User.find(params[:id])
    
    if @user.update(role: 'admin')
      render json: { message: 'User promoted to admin', user: @user }, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'User not found' }, status: :not_found
  end

  def demote_user
    @user = User.find(params[:id])
    
    if @user.id == current_user.id
      render json: { message: 'Cannot demote yourself' }, status: :unprocessable_entity
      return
    end

    if @user.update(role: 'user')
      render json: { message: 'User demoted to regular user', user: @user }, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'User not found' }, status: :not_found
  end

  private

  def admin_only
    render json: { message: 'Admin access required' }, status: :forbidden unless current_user.is_admin?
  end
end
