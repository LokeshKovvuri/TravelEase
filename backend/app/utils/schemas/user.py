from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role:str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str