class Api::ApplicationController < ApplicationController
  before_action :set_default_response_format
  before_action :authorize_request

  def set_default_response_format
    request.format = :json
  end

  def authorize_request
    authorized
  end
end
