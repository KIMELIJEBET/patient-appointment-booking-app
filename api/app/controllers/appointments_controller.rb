class AppointmentsController < ApplicationController
  before_action :authorized

  def index
    appointments = current_user.appointments
    render json: appointments
  end

  def create
    appointment = current_user.appointments.create(appointment_params)
    if appointment.persisted?
      render json: appointment, status: :created
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end
  def show
    appointment = current_user.appointments.find_by(id: params[:id])
    if appointment
      render json: appointment
    else
      render json: { error: "Appointment not found" }, status: :not_found
    end
  end
  def update
    appointment = current_user.appointments.find_by(id: params[:id])
    if appointment&.update(appointment_params)
      render json: appointment
    else
      render json: { errors: appointment ? appointment.errors.full_messages : ["Appointment not found"] }, status: :unprocessable_entity
    end
  end
  def destroy
    appointment = current_user.appointments.find_by(id: params[:id])
    if appointment
      appointment.destroy
      render json: { message: "Appointment deleted successfully" }
    else
      render json: { error: "Appointment not found" }, status: :not_found
    end
  end

  private

  def appointment_params
    params.require(:appointment).permit(:patient_name, :appointment_date, :reason)
  end
end
