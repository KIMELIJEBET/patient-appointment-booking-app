class User < ApplicationRecord
  #handles password hashing and authentication
  has_secure_password
  has_many :appointments, :dependent => :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end
