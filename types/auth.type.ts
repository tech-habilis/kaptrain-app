import { GENDER } from "../constants/gender.constant";
import { TUserSubscription } from "./subscription.type";

export type TPayloadSignIn = { email: string; password: string }
export type TPayloadSignUp = TPayloadSignIn & {
  firstName: string
  lastName: string
  phoneNumber: string
}
export type TPayloadResendSignUpVerificationMail = Pick<TPayloadSignUp, "email">
export type TPayloadSendForgotPasswordMail = Pick<TPayloadSignIn, "email"> & {
  redirectTo: string
}
export type TPayloadResetPassword = Pick<TPayloadSignIn, "password">

export type TAuthUser = {
    id: string
    email: string
    name: string
    firstName?: string
    lastName?: string | null
    role: string | null
    profilePicture: string | null
    subscription?: TUserSubscription | null
    paymentGatewayId?: string | null
    gender: (typeof GENDER)[keyof typeof GENDER] | null
    dateOfBirth: Date | null
    phoneNumber: string | null
    created_at: Date | null
  }

  export type TPayloadVerifyOtp = {
    email: string
    token: string,
  }