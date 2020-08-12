// AUTO_GENERATED Do not change this file directly change config.ts file instead
import { AxiosRequestConfig } from "axios";
import { SwaggerResponse, responseWrapper } from "./config";
import { Http, overrideConfig } from "./httpRequest";

function template(path: string, obj: { [x: string]: any } = {}) {
  Object.keys(obj).forEach((key) => {
    let re = new RegExp(`{${key}}`, "i");
    path = path.replace(re, obj[key]);
  });

  return path;
}

/** Get user accounts [Or get sub user authorized accounts] */
export async function getAccount(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AccountSummaryWithBalanceQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create a new account. [Feature is not allowed for sub users] */
export async function postAccount(
  requestBody: AccountInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AccountSummaryWithBalanceQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Account", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get user account detail [Feature is not allowed for sub users] */
export async function getAccountId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AccountDetailQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Edit user account [Feature is not allowed for sub users] [Needs secure login] */
export async function putAccountId(
  id: number,
  requestBody: AccountInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AccountSummaryWithBalanceQuery>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/Account/{id}", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Edit user account notification status [Feature is not allowed for sub users]
 * [Needs secure login]
 */
export async function putAccountIdNotification(
  id: number,
  requestBody: AccountNotificationStatusInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/Account/{id}/notification", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Get user account balance */
export async function getAccountIdBalance(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AccountBalanceSummaryQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/{id}/balance", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function getAccountAccountIdPermittedSubUsers(
  accountId: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AccountPermittedSubUserQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/{accountId}/PermittedSubUsers", { accountId }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create a new account charge request */
export async function postAccountIdCharge(
  id: number,
  requestBody: NewChargeRequestInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewChargeRequestResultQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Account/{id}/charge", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get comission amount for epay request amount */
export async function getAccountIdEpayRequestComission(
  id: number,
  queryParams: { amount: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<CommissionApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/{id}/epayRequest/comission", { id }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create a new epay request */
export async function postAccountIdEpayRequest(
  id: number,
  requestBody: NewEpayRequestInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewEpayRequestResultQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Account/{id}/epayRequest", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get comission amount for settlement request amount */
export async function getAccountIdSettlementRequestComission(
  id: number,
  queryParams: { amount: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<CommissionApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/{id}/settlementRequest/comission", { id }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create a new settlement request [Needs secure login] */
export async function postAccountIdSettlementRequest(
  id: number,
  requestBody: NewSettlementRequestInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SettlementRequestQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Account/{id}/settlementRequest", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get insensitive data of account owner */
export async function getAccountSearch(
  queryParams?: {
    userId?: string;
    accountId?: number;
    customerNumber?: number;
    accountNumber?: string;
    contact?: string;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<InsensitiveAccountApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/search", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get comission amount for transfer money amount */
export async function getAccountIdTransferMoneyCommission(
  id: number,
  queryParams: { amount: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<CommissionApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Account/{id}/transferMoney/commission", { id }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Transfer money */
export async function postAccountIdTransferMoney(
  id: number,
  requestBody: TransferMoneyInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<TransferMoneyApiModel>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Account/{id}/transferMoney", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** SiginIn using ApiKey and SecretKey */
export async function postAuthApilogin(
  requestBody: ApiLoginInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/apilogin", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Sign in and get a new long-lived JWT */
export async function postAuthLogin(
  requestBody: LoginInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/login", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function postAuthLoginOtp(
  requestBody: TotpLoginInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/login/otp", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function postAuthLoginOtpGenerate(
  requestBody: RequestTotpInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/login/otp/generate", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Sign in as a sub user (JWT) */
export async function postAuthLoginSubuser(
  requestBody: SubUserLoginInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/login/subuser", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get a new short-lived JWT, using current long-lived one */
export async function postAuthLoginSecurity(
  requestBody: SecureLoginInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/login/security", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Refresh the short-lived JWT, using current short-lived one */
export async function getAuthLoginSecurityRefresh(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Auth/login/security/refresh", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Check the data that the user has been logged in */
export async function postAuthCheck(
  requestBody: LoginInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/check", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Log out */
export async function postAuthLogout(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/logout", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Register new user with the phone number (Two factor authentication) */
export async function postAuthRegister(
  requestBody: RegisterInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<RegisterNewUserQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/register", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Confirm the phone number with verification code */
export async function postAuthRegisterVerify(
  requestBody: ConfirmPhoneNumberOrEmailInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ConfirmPhoneNumberQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/register/verify", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Confirm phone number with the given token and auto signin user to app. */
export async function postAuthRegisterPoslogin(
  requestBody: ConfirmPhoneNumberOrEmailInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewTokenResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/register/poslogin", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Set basic data for your registration [fullname, password] */
export async function postAuthRegisterBasic(
  requestBody: SetUserBasicInfoInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/register/basic", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Recover forgotten password with phone number (Two factor authentication) */
export async function postAuthForgetPassword(
  requestBody: UserForgetPasswordInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/forgetPassword", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Confirm the phone number with a verification code for recover password */
export async function postAuthForgetPasswordVerify(
  requestBody: UserVerifyForgetPasswordInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ConfirmPhoneNumberQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/forgetPassword/verify", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Reset forgotten password */
export async function postAuthForgetPasswordResetPassword(
  requestBody: UserResetForgetPasswordInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/forgetPassword/resetPassword", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Register new Device for current user. */
export async function postAuthRegisterDevice(
  requestBody: RegisterDeviceInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Auth/register/device", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Get available banks */
export async function getBank(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<BankQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Bank", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get Business categories */
export async function getBusinessUserCategory(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<BusinessCategoryQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/category", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Send a connection request to sub user [Feature just allowed for the business
 * users]
 */
export async function postBusinessUserInvite(
  requestBody: SendConnectionRequestInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/BusinessUser/invite", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Resend Connection Request to Sub-User [Feature just allowed for the business
 * users]
 */
export async function postBusinessUserInviteInvitationIdResend(
  invitationId: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/BusinessUser/invite/{invitationId}/resend", { invitationId }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Remove an invitation [Feature just allowed for the business users] [Needs
 * secure login]
 */
export async function deleteBusinessUserInviteInvitationIdRemove(
  invitationId: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery>> {
  return await responseWrapper(
    await Http.deleteRequest(
      template("/BusinessUser/invite/{invitationId}/remove", { invitationId }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Resend Connection Request to Sub-User [Feature just allowed for the business
 * users]
 */
export async function postBusinessUserResendInvitationId(
  invitationId: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/BusinessUser/resend/{invitationId}", { invitationId }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Remove an invitation [Feature just allowed for the business users] [Needs
 * secure login]
 */
export async function deleteBusinessUserConnectionInvitationIdRemove(
  invitationId: string,
  queryParams: { id: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery>> {
  return await responseWrapper(
    await Http.deleteRequest(
      template("/BusinessUser/connection/{invitationId}/remove", {
        invitationId,
      }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get the connections [Feature just allowed for the business users] */
export async function getBusinessUserConnection(
  queryParams?: {
    subUserConnectionStatus?: undefined;
    skip?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/connection", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get active connections ordered by Transactions count [Feature just allowed for
 * the business users]
 */
export async function getBusinessUserConnectionActive(
  queryParams?: { skip?: number; take?: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/connection/active", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get the connection amounts report [Feature just allowed for the business users]
 * [Needs secure login]
 */
export async function getBusinessUserConnectionId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionAmountsReportQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/connection/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Change sub user connection info [Feature just allowed for the business users]
 * [Needs secure login]
 */
export async function putBusinessUserConnectionId(
  id: number,
  requestBody: EditConnectionInfoInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/BusinessUser/connection/{id}", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Disconnect sub user connection [Feature just allowed for the business users]
 * [Needs secure login]
 */
export async function deleteBusinessUserConnectionId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserConnectionQuery>> {
  return await responseWrapper(
    await Http.deleteRequest(
      template("/BusinessUser/connection/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get sub user permissions for accounts [Feature just allowed for the business
 * users] [Needs secure login]
 */
export async function getBusinessUserConnectionIdPermission(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserPermissionQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/connection/{id}/permission", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Set access to the account for sub user [Feature just allowed for the business
 * users] [Needs secure login]
 */
export async function postBusinessUserConnectionIdPermission(
  id: number,
  requestBody: SetAccountAccessForSubUserInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/BusinessUser/connection/{id}/permission", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Edit sub user permission for the account [Feature just allowed for the business
 * users] [Needs secure token]
 */
export async function putBusinessUserConnectionIdPermissionAccountId(
  id: number,
  accountId: number,
  requestBody: EditSubUserPermissionInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/BusinessUser/connection/{id}/permission/{accountId}", {
        id,
        accountId,
      }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Remove access to the account for sub user [Feature just allowed for the
 * business users] [Needs secure token]
 */
export async function deleteBusinessUserConnectionIdPermissionAccountId(
  id: number,
  accountId: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.deleteRequest(
      template("/BusinessUser/connection/{id}/permission/{accountId}", {
        id,
        accountId,
      }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Get EPay Requests created by SubUser [Feature just allowed for the business
 * users] [Needs secure login]
 */
export async function getBusinessUserConnectionIdEpay(
  id: number,
  queryParams?: {
    accountId?: number;
    epayRequestStatus?: undefined;
    startDate?: string;
    endDate?: string;
    pluginId?: number;
    plugin_ZhenicCustomerName?: string;
    plugin_ZhenicCustomerNumber?: string;
    plugin_ZhenicInvoiceNumber?: string;
    plugin_ZhenicRialAmount?: string;
    plugin_ZhenicDollarAmount?: string;
    plugin_ZhenicDollarAmountRate?: string;
    plugin_ZhenicEuroAmount?: string;
    plugin_ZhenicEuroAmountRate?: string;
    plugin_SepidarCustomerName?: string;
    plugin_SepidarCustomerNumber?: string;
    plugin_SepidarDocumentNumber?: string;
    plugin_SepidarVoucherType?: string;
    skip?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<EpayRequestQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/connection/{id}/epay", { id }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get Settlement Requests created by a SubUser [Feature just allowed for the
 * business users] [Needs secure login]
 */
export async function getBusinessUserConnectionIdSettlement(
  id: number,
  queryParams?: {
    accountId?: number;
    startDate?: string;
    endDate?: string;
    minimumAmount?: number;
    maximumAmount?: number;
    skip?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SettlementRequestQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/BusinessUser/connection/{id}/settlement", { id }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get user pay requests (and sub user authorized accounts pay requests) [Needs
 * secure login]
 */
export async function getEpayRequest(
  queryParams?: {
    accountId?: number;
    epayRequestStatus?: undefined;
    startDate?: string;
    endDate?: string;
    pluginId?: number;
    plugin_ZhenicCustomerName?: string;
    plugin_ZhenicCustomerNumber?: string;
    plugin_ZhenicInvoiceNumber?: string;
    plugin_ZhenicRialAmount?: string;
    plugin_ZhenicDollarAmount?: string;
    plugin_ZhenicDollarAmountRate?: string;
    plugin_ZhenicEuroAmount?: string;
    plugin_ZhenicEuroAmountRate?: string;
    plugin_SepidarCustomerName?: string;
    plugin_SepidarCustomerNumber?: string;
    plugin_SepidarDocumentNumber?: string;
    plugin_SepidarVoucherType?: string;
    skip?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<EpayRequestQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/EpayRequest", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get epay request detail based on Id */
export async function getEpayRequestId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewEpayRequestResultQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/EpayRequest/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get QR code image file for epay request */
export async function getEpayRequestTokenQrCode(
  token: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/EpayRequest/{token}/qrCode", { token }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Undefined */
export async function getEpayRequestPosQrAccountNo(
  accountNo: string,
  queryParams?: { amount?: number; subUserConId?: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/EpayRequest/pos/Qr/{accountNo}", { accountNo }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Get pay requests that the user is one of its audiences. [Feature is not allowed
 * for sub users] [Needs secure login]
 */
export async function getEpayRequestForMe(
  queryParams?: {
    applicantName?: string;
    startDate?: string;
    endDate?: string;
    epayRequestStatus?: undefined;
    skip?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<EpayRequestForUserQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/EpayRequest/forMe", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create a new task for executing the actions of epay request [Resend/Cancel] */
export async function postEpayRequestIdTask(
  id: number,
  requestBody: EpayRequestTaskInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/EpayRequest/{id}/task", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Undefined */
export async function getEpayRequestAudiencesRecent(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ContactApiModel[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/EpayRequest/audiences/recent", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Upload new file [Allowed files are images and pdf / Max Size: 3 MB] */
export async function postFile(
  requestBody: { file?: string },
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<FileUploadQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/File", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Download a file. */
export async function getFileId(
  id: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/File/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** For Business users only] */
export async function putGroupTransferAdd(
  requestBody: GroupTransferTargetValidationInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<GroupTransferTargetValidationQuery>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/GroupTransfer/add", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** For Business users only] */
export async function postGroupTransferImport(
  requestBody: { file?: string },
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<GroupTransferTargetValidationQuery[]>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/GroupTransfer/import", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })
    )
  );
}

/** For Business users only] */
export async function postGroupTransferExport(
  requestBody: GroupTransferTargetValidationQuery[],
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/GroupTransfer/export", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** For Business users only] */
export async function postGroupTransferTransfer(
  requestBody: GroupTransferInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<GroupTransferQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/GroupTransfer/transfer", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get commission amount for group transfer [for Business users only] */
export async function getGroupTransferCommission(
  queryParams: { accountId: number; amount: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<CommissionApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/GroupTransfer/commission", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function getNotificationIa(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ImportantActionApiModel[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Notification/ia", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function putNotificationIaNotifId(
  notifId: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<FileUploadQuery>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/Notification/ia/{notifId}", { notifId }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function getPluginId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<PluginApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Plugin/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get epay request detail */
export async function getPosAccountNo(
  accountNo: string,
  queryParams?: { subUserConId?: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<PosLandingPageApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Pos/{accountNo}", { accountNo }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Pay POS link with Wallet */
export async function postPosPayTargetAccountNoWallet(
  targetAccountNo: string,
  requestBody: PosWalletPayInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ReceiptApiModel>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Pos/pay/{targetAccountNo}/wallet", { targetAccountNo }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Pay POS link Online */
export async function postPosPayTargetAccountNoOnline(
  targetAccountNo: string,
  requestBody: PosOnlinePayInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<NewEpayRequestResultQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Pos/pay/{targetAccountNo}/online", { targetAccountNo }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get a receipt by it's id */
export async function getReceiptToken(
  token: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ReceiptApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Receipt/{token}", { token }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get the Resellership info of current Reseller user [Feature just allowed for
 * Resellers]
 */
export async function getResellerUser(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ResellerApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get filter data items to populate DropDowns [Feature just allowed for
 * Resellers]
 */
export async function getResellerUserIntroducedFilterData(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ReselledUserFilterData>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/introduced/filterData", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get the Users Introduced by current Reseller user [Feature just allowed for
 * Resellers]
 */
export async function getResellerUserIntroduced(
  queryParams?: {
    searchInput?: string;
    isActive?: boolean;
    isPerson?: boolean;
    identityStatuses?: IdentityStatus[];
    lastActivityFrom?: string;
    lastActivityTo?: string;
    registeredFrom?: string;
    registeredTo?: string;
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDesc?: boolean;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ReselledUserApiModel[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/introduced", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get the User activity [Feature just allowed for Resellers] */
export async function getResellerUserIntroducedUserIdActivity(
  userId: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ReselledUserActivityApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/introduced/{userId}/activity", { userId }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get sum of all commissions paid to current Reseller user [Feature just allowed
 * for Resellers]
 */
export async function getResellerUserDashboardCommissionSum(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AggregationReportQueryOfDecimal>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/commission/sum", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get the time-based report of commissions paid to current Reseller user [Feature
 * just allowed for Resellers]
 */
export async function getResellerUserDashboardCommissionReport(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DateReportQueryOfDecimal[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/commission/report", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get count of all links generated by users, who are introduced by current
 * Reseller user [Feature just allowed for Resellers]
 */
export async function getResellerUserDashboardLinksCount(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AggregationReportQueryOfInteger>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/links/count", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get time-based report of links generated by users, who are introduced by
 * current Reseller user [Feature just allowed for Resellers]
 */
export async function getResellerUserDashboardLinksReport(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DateReportQueryOfInteger[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/links/report", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get count of all paid links generated by users, who are introduced by current
 * Reseller user [Feature just allowed for Resellers]
 */
export async function getResellerUserDashboardLinksPaidCount(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AggregationReportQueryOfInteger>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/links/paid/count", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get time-based report of paid links generated by users, who are introduced by
 * current Reseller user [Feature just allowed for Resellers]
 */
export async function getResellerUserDashboardLinksPaidReport(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DateReportQueryOfInteger[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/links/paid/report", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get count of all commission transactions, paid to current Reseller user
 * [Feature just allowed for Resellers]
 */
export async function getResellerUserDashboardTransactionsCount(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AggregationReportQueryOfInteger>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/transactions/count", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get time-based report of commission transactions, paid to current Reseller user
 * [Feature just allowed for Resellers]
 */
export async function getResellerUserDashboardTransactionsReport(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DateReportQueryOfInteger[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/transactions/report", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get count of all users reselled by current Reseller user [Feature just allowed
 * for Resellers]
 */
export async function getResellerUserDashboardIntroducedCount(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<AggregationReportQueryOfInteger>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/introduced/count", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get time-based report of users reselled by current Reseller user [Feature just
 * allowed for Resellers]
 */
export async function getResellerUserDashboardIntroducedReport(
  queryParams?: {
    month?: number;
    year?: number;
    takeDays?: number;
    takeMonths?: number;
    takeYears?: number;
    fromMonth?: number;
    fromYear?: number;
    toMonth?: number;
    toYear?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DateReportQueryOfInteger[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/ResellerUser/dashboard/introduced/report", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create an new [EpayRequest] with the given model. */
export async function postServiceNewEpayRequest(
  requestBody: EpayRequestServiceInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<EpayRequestWcfResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/NewEpayRequest", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Check the [EpayRequest] based on token */
export async function postServiceCheckEpayRequest(
  requestBody: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<EpayRequestCheckStatusResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/CheckEpayRequest", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Verify the ApiKey for authorizing the [User] */
export async function postServiceVerifyApiKey(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<boolean>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/VerifyApiKey", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Create a Divided [EpayRequest] for the given model. */
export async function postServiceNewDivideEpayRequest(
  requestBody: DivideEpayRequestServiceInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<EpayRequestWcfResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/NewDivideEpayRequest", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Unblock Amount of an Divided[EpayRequest] */
export async function postServiceUnblockAmount(
  requestBody: DividedEpayRequestUnblockInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DividedEpayRequestUnblockResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/UnblockAmount", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Cancel Amount of an Divided[EpayRequest] */
export async function postServiceCancelAmount(
  requestBody: DividedEpayRequestCancelInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<DividedEpayRequestCancelResult>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/CancelAmount", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Set [EPayRequest] status to 'Cancel' and cancel the payment */
export async function postServiceCancelPayment(
  requestBody: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<boolean>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Service/CancelPayment", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get user settlement requests (or sub user authorized accounts settlement
 * requests)
 */
export async function getSettlementRequest(
  queryParams?: {
    accountId?: number;
    startDate?: string;
    endDate?: string;
    minimumAmount?: number;
    maximumAmount?: number;
    skip?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SettlementRequestQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/SettlementRequest", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get info of a SubDomain by it's address. */
export async function getSubDomainSubDomainAddress(
  subDomainAddress: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubDomainApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/SubDomain/{subDomainAddress}", { subDomainAddress }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get the SubDomain of current Reseller user [Feature just allowed for Resellers] */
export async function getSubDomain(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubDomainApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/SubDomain", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Update the SubDomain of current Reseller user [Feature just allowed for
 * Resellers]
 */
export async function putSubDomain(
  requestBody: SubDomainUpdateApiModel,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubDomainApiModel>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/SubDomain", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Disconnect business user connection [Feature just allowed for the sub users]
 * [Needs secure login]
 */
export async function deleteSubUserConnectionId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<BusinessUserConnectionQuery>> {
  return await responseWrapper(
    await Http.deleteRequest(
      template("/SubUser/connection/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get the connections [Feature just allowed for the sub users] */
export async function getSubUserConnection(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<BusinessUserConnectionQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/SubUser/connection", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function getSubUserAccountId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserAccountDetailQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/SubUser/account/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Enables/Disables sending notifications to current SubUser for transactions on
 * specified Account [allowed for the SubUsers only]
 */
export async function postSubUserNotificationId(
  id: number,
  requestBody: SubUserNotificationStatusInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/SubUser/notification/{id}", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Get user account transactions (sub user authorized accounts transactions)
 * [Needs secure login]
 */
export async function getTransaction(
  queryParams?: {
    accountId?: number;
    transactionType?: undefined;
    startDate?: string;
    endDate?: string;
    limit?: number;
    take?: number;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<TransactionApiModel[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Transaction", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get insensitive data of account owner */
export async function getTransferSearch(
  queryParams?: {
    userId?: string;
    accountId?: number;
    customerNumber?: number;
    accountNumber?: string;
    contact?: string;
  },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<InsensitiveAccountApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Transfer/search", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get recent money transfers */
export async function getTransferRecent(
  queryParams?: { take?: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<TransferMoneyApiModel[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Transfer/recent", {}),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get commission amount for transfer money amount */
export async function getTransferAccountIdCommission(
  accountId: number,
  queryParams: { amount: number },

  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<CommissionApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/Transfer/{accountId}/commission", { accountId }),
      queryParams,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Transfer money */
export async function postTransferAccountId(
  accountId: number,
  requestBody: TransferMoneyInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<TransferMoneyApiModel>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/Transfer/{accountId}", { accountId }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get user banks [Feature is not allowed for sub users.] */
export async function getUserBank(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserBankQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/UserBank", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Create a new user bank [Feature is not allowed for sub users] [Needs secure
 * login]
 */
export async function postUserBank(
  requestBody: UserBankInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserBankQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/UserBank", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get available user banks [Feature is not allowed for sub users.] */
export async function getUserBankReady(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserBankQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/UserBank/ready", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get user bank detail [Needs secure login] */
export async function getUserBankId(
  id: number,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserBankDetailQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/UserBank/{id}", { id }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Edit user bank [Needs secure login] */
export async function putUserBankId(
  id: number,
  requestBody: UserBankInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserBankQuery>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/UserBank/{id}", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Change user bank show-in-list property [Needs secure login] */
export async function putUserBankIdChangeVisibility(
  id: number,
  requestBody: UserBankChangeVisibilityInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/UserBank/{id}/changeVisibility", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Get [normal/sub/business] user profile detail */
export async function getUser(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserDetailQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Edit profile [state, city, address] [Feature is not allowed for business users]
 * [Needs secure login]
 */
export async function putUser(
  requestBody: UserProfileInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserDetailQuery>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/User", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function getUserContactInput(
  input: string,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<ContactApiModel>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User/contact/{input}", { input }),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Change user avatar [Needs secure login] */
export async function putUserChangeAvatar(
  requestBody: UserProfileAvatarInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/User/changeAvatar", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/**
 * Create a new national id verification request [Feature is not allowed for
 * business users]
 */
export async function postUserIdentityRequest(
  requestBody: NewUserIdentityRequestInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserDetailQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/User/identityRequest", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get last national id verification request [Feature is not allowed for business
 * users]
 */
export async function getUserIdentityRequest(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserIdentityRequestQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User/identityRequest", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Change user phone number [Needs secure login] */
export async function postUserChangePhoneNumber(
  requestBody: UserChangePhoneNumberInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/User/changePhoneNumber", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Confirm the phone number with a verification code for change phone number */
export async function postUserChangePhoneNumberVerify(
  requestBody: UserVerifyChangePhoneNumberInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/User/changePhoneNumber/verify", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Change user password */
export async function postUserChangePassword(
  requestBody: UserChangePasswordInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/User/changePassword", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Get user profile summary */
export async function getUserMe(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserMeQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User/me", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Request for upgrade account to the business [Feature just allowed for the
 * normal users]
 */
export async function postUserUpgradeToBusinessRequest(
  requestBody: UpgradeToBusinessUserInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UpgradeToBusinessUserQuery>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/User/upgradeToBusinessRequest", {}),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Get Last Request for upgrade account to the business [Feature just allowed for
 * the normal users]
 */
export async function getUserUpgradeToBusinessRequest(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UpgradeToBusinessUserQuery>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User/upgradeToBusinessRequest", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/**
 * Create a new task for executing the actions of the business user invitation
 * [Accept/Reject] [Feature is not allowed for sub users]
 */
export async function postUserInvitationIdTask(
  id: number,
  requestBody: SubuserInvitationTaskInput,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<string>> {
  return await responseWrapper(
    await Http.postRequest(
      template("/User/invitation/{id}/task", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      })
    )
  );
}

/** Get business user invitations for me [Feature is not allowed for sub users] */
export async function getUserInvitation(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<SubUserInvitationQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User/invitation", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Get user workspaces [Feature is not allowed for sub users] */
export async function getUserWorkspace(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserWorkspaceQuery[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/User/workspace", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function getUserPlugin(
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserPluginInfoApiModel[]>> {
  return await responseWrapper(
    await Http.getRequest(
      template("/UserPlugin", {}),
      undefined,
      undefined,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

/** Undefined */
export async function putUserPluginIdChangeStatus(
  id: number,
  requestBody: UserPluginTogggleApiModel,
  configOverride?: AxiosRequestConfig
): Promise<SwaggerResponse<UserPluginApiModel>> {
  return await responseWrapper(
    await Http.putRequest(
      template("/UserPlugin/{id}/ChangeStatus", { id }),
      undefined,
      requestBody,
      overrideConfig(configOverride, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    )
  );
}

export interface AccountSummaryWithBalanceQuery {
  id: number;
  title?: string;
  number?: string;
  isActive: boolean;
  intermediateUserBankBankId?: number;
  intermediateUserBankBankName?: string;
  intermediateUserBankAccountNumber?: string;
  intermediateUserBankShebaNumber?: string;
  directUserBankBankId?: number;
  directUserBankBankName?: string;
  directUserBankAccountNumber?: string;
  directUserBankShebaNumber?: string;
  relatedUserAccountIndex?: number;
  getComissionFromPayer: boolean;
  totalBalance: number;
  realBalance: number;
}

export interface AccountDetailQuery extends AccountSummaryWithBalanceQuery {
  automaticSettlement: boolean;
  currencyType: CurrencyType;
  actionPolicies?: ActionPolicyCommissionDetailQuery[];
  accountQrCodeUrl?: string;
  posLinkUrl?: string;
  notificationEnabled: boolean;
  posScanCount: number;
  posPaidCount: number;
  permittedSubuserCount: number;
}

export enum CurrencyType {
  Rial = "Rial",
}

export interface ActionPolicyCommissionDetailQuery {
  title?: string;
  value?: string;
}

export interface AccountInput {
  title?: string;
  isActive?: boolean;
  userBankId?: number;
  getComissionFromPayer?: boolean;
  automaticSettlement?: boolean;
  currencyType?: undefined;
}

export interface AccountNotificationStatusInput {
  notificationEnabled: boolean;
}

export interface AccountBalanceSummaryQuery {
  totalBalance: number;
  realBalance: number;
}

export interface AccountPermittedSubUserQuery {
  subuserId: string;
  subUserTitle?: string;
  subUserPositionTitle?: string;
  subUserContact?: string;
  connectDate?: string;
  disconnectDate?: string;
  subuserStatus: SubuserStatus;
  subUserConnectionStatus: SubUserConnectionStatus;
  subuserStatusDisplay?: string;
  subUserAvatarUrl?: string;
  connectionId: number;
}

export enum SubuserStatus {
  Connected = "Connected",
  DisconnectedByBusinessUser = "DisconnectedByBusinessUser",
  DisconnectedBySubUser = "DisconnectedBySubUser",
}

export enum SubUserConnectionStatus {
  Pending = "Pending",
  Rejected = "Rejected",
  Connected = "Connected",
  Disconnected = "Disconnected",
  Deleted = "Deleted",
}

export interface NewChargeRequestResultQuery {
  paymentLink?: string;
}

export interface NewChargeRequestInput {
  amount: number;
  callbackUrl?: string;
}

export interface CommissionApiModel {
  comissionAmount: number;
  commissionAmount: number;
}

export interface NewEpayRequestResultQuery {
  id: number;
  token?: string;
  createDate?: string;
  pluginName?: string;
  pluginId?: number;
  amount: number;
  userAccountId: number;
  userAccountName?: string;
  expireDate?: string;
  getComissionByPayer: boolean;
  comissionAmount: number;
  paymentLink?: string;
  qrCodeLink?: string;
  epayRequestStatus: EpayRequestStatus;
  description?: string;
  epayRequestAudience?: EPayRequestAudienceInput[];
  epayRequestPluginSpecific?: EpayRequestPluginSpecificOutput[];
}

export enum EpayRequestStatus {
  Initiated = "Initiated",
  Paid = "Paid",
  Cancelled = "Cancelled",
  Expired = "Expired",
  Viewed = "Viewed",
}

export interface EPayRequestAudienceInput {
  fullName?: string;
  contact?: string;
}

export interface EpayRequestPluginSpecificOutput {
  pluginPropertyName?: string;
  pluginPropertyPersianName?: string;
  pluginPropertyId?: string;
  value?: string;
}

export interface NewEpayRequestInput {
  amount: number;
  expireDays: number;
  isAutoConfirm: boolean;
  callbackUrl?: string;
  callbackType: undefined;
  description?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  audiences?: EPayRequestAudienceInput[];
  pluginId?: number;
  pluginSpecifics?: EpayRequestPluginSpecificInput[];
  getComissionByPayer?: boolean;
}

export enum CallbackType {
  None = "None",
  Redirect = "Redirect",
  RedirectWithPost = "RedirectWithPost",
  Call = "Call",
}

export interface EpayRequestPluginSpecificInput {
  pluginPropertyId?: string;
  value?: string;
}

export interface SettlementRequestQuery {
  id: number;
  accountId: number;
  accountName?: string;
  accountNumber?: string;
  bankId: number;
  bankName?: string;
  createDate?: string;
  createDateTime: string;
  automaticSettlement: boolean;
  status: SettlementRequestStatus;
  requestAmount: number;
  comissionAmount: number;
  finalAmount: number;
}

export enum SettlementRequestStatus {
  Pending = "Pending",
  Paid = "Paid",
}

export interface NewSettlementRequestInput {
  amount: number;
  description?: string;
}

export interface InsensitiveAccountApiModel {
  accountId: number;
  accountOwnerTitle?: string;
  accountOwnerAvatarUrl?: string;
}

export interface TransferMoneyApiModel {
  id: number;
  amount: number;
  domainCommissionAmount: number;
  description?: string;
  targetAccountId: number;
  targetAccountNumber?: string;
  targetUserDisplayName?: string;
  targetUserAvatarUrl?: string;
  createdDate?: string;
  createdDateTime: string;
  userAccountId: number;
  userAccountName?: string;
}

export interface TransferMoneyInput {
  targetUserAccountId: number;
  amount: number;
  description?: string;
}

export interface NewTokenResult {
  token: string;
  expires: number;
  mustChangePassword: boolean;
}

export interface ApiLoginInput {
  secretKey?: string;
  apiKey?: string;
}

export interface LoginInput {
  userName?: string;
  password?: string;
}

export interface TotpLoginInput {
  phoneNumber?: string;
  token?: string;
}

export interface RequestTotpInput {
  phoneNumber?: string;
}

export interface SubUserLoginInput {
  businessId: string;
}

export interface SecureLoginInput {
  password?: string;
}

export interface RegisterNewUserQuery {
  userId: string;
}

export enum LanguageType {
  Fa = "Fa",
  En = "En",
}

export enum OsPlatformType {
  Web = "Web",
  Android = "Android",
  Ios = "Ios",
  Windows = "Windows",
  PWA = "PWA",
}

export interface RegisterInput {
  phoneNumber?: string;
  deviceId?: string;
  deviceBrandName?: string;
  deviceOsVersion?: string;
}

export interface ConfirmPhoneNumberQuery {
  token?: string;
}

export interface ConfirmPhoneNumberOrEmailInput {
  userId?: string;
  token?: string;
  subDomainId?: string;
}

export interface SetUserBasicInfoInput {
  userId?: string;
  token?: string;
  password?: string;
  fullName?: string;
  introducerCode?: string;
}

export interface UserForgetPasswordInput {
  phoneNumber?: string;
}

export interface UserVerifyForgetPasswordInput {
  phoneNumber?: string;
  token?: string;
}

export interface UserResetForgetPasswordInput {
  phoneNumber?: string;
  token?: string;
  newPassword?: string;
}

export interface RegisterDeviceInput {
  deviceId?: string;
  deviceBrandName?: string;
  deviceOsVersion?: string;
  deviceToken?: string;
}

export interface BankQuery {
  id: number;
  name?: string;
  logoUrl?: string;
}

export interface BusinessCategoryQuery {
  id: BusinessType;
  title?: string;
}

export enum BusinessType {
  Ads = "Ads",
  Investment = "Investment",
  Production = "Production",
  Trade = "Trade",
  Software = "Software",
}

export interface SubUserConnectionQuery {
  invitationId: number;
  connectDate?: string;
  disconnectDate?: string;
  requestDate?: string;
  removeDate?: string;
  subUserAvatarUrl?: string;
  subUserTitle?: string;
  subUserContact?: string;
  subUserPositionTitle?: string;
  subUserConnectionStatus: SubUserConnectionStatus;
  connectionId?: number;
}

export interface SendConnectionRequestInput {
  phoneNumber?: string;
  email?: string;
  position?: string;
}

export interface SubUserConnectionAmountsReportQuery {
  paidEpayRequestCount: number;
  paidEpayRequestAmount: number;
  accountChargeRequestCount: number;
  accountChargeRequestAmount: number;
  settlementRequestCount: number;
  settlementRequestAmount: number;
}

export interface EditConnectionInfoInput {
  position?: string;
}

export interface SubUserPermissionQuery extends SubUserActionPermission {
  accountId: number;
  accountTitle?: string;
  accountNumber?: string;
  totalBalance: number;
  realBalance: number;
}

export interface SubUserActionPermission {
  canAccessToAccount: boolean;
  canReceiveMoney: boolean;
  canSeeEpayRequests: boolean;
  canTransferMoney: boolean;
  canGroupTransferMoney: boolean;
  canSeeTransactions: boolean;
  canRequestSettlement: boolean;
  canChargeAccount: boolean;
  canSeeSettlementRequests: boolean;
}

export interface SetAccountAccessForSubUserInput {
  accountId?: number;
}

export interface EditSubUserPermissionInput {
  subUserPermissionType?: undefined;
  isEnabled?: boolean;
}

export enum SubUserPermissionType {
  CanReceiveMoney = "CanReceiveMoney",
  CanSeeEpayRequests = "CanSeeEpayRequests",
  CanTransferMoney = "CanTransferMoney",
  CanSeeTransactions = "CanSeeTransactions",
  CanRequestSettlement = "CanRequestSettlement",
  CanChargeAccount = "CanChargeAccount",
  CanSeeSettlementRequests = "CanSeeSettlementRequests",
  CanGroupTransferMoney = "CanGroupTransferMoney",
}

export interface EpayRequestQuery {
  id: number;
  createDate?: string;
  createDateTime: string;
  expireDate?: string;
  expireDateTime: string;
  payDate?: string;
  payDateTime?: string;
  amount: number;
  description?: string;
  userAccountId: number;
  userAccountName?: string;
  paymentLink?: string;
  qrCodeLink?: string;
  epayRequestStatus: EpayRequestStatus;
  epayRequestAudience?: EPayRequestAudienceInput[];
}

export interface EpayRequestForUserQuery {
  id: number;
  applicantName?: string;
  expireDate?: string;
  amount: number;
  description?: string;
  canBeCanceled: boolean;
  paymentUrl?: string;
  epayRequestStatus: EpayRequestStatus;
}

export interface EpayRequestTaskInput {
  epayRequestTaskType: EpayRequestTaskType;
}

export enum EpayRequestTaskType {
  Resend = "Resend",
  Cancel = "Cancel",
}

export interface ContactApiModel {
  fullName?: string;
  contact?: string;
  audienceType: EpayRequestAudienceType;
  audienceTypeDisplay?: string;
  userId?: string;
  userDisplayName?: string;
  userProfileImageLink?: string;
  userProfileImageName?: string;
  userProfileImageUniqueId?: string;
}

export enum EpayRequestAudienceType {
  Default = "Default",
  PhoneNumber = "PhoneNumber",
  Email = "Email",
  CustomerNumber = "CustomerNumber",
}

export interface FileUploadQuery {
  uniqueId: string;
  fileName?: string;
  fileSize: number;
  fileUrl?: string;
}

export interface GroupTransferTargetValidationQuery {
  amount: number;
  name?: string;
  identifier?: string;
  accountNumber?: string;
  userDisplayName?: string;
  userPhoneNumber?: string;
  status: GroupTransferTargetStatus;
  statusDescription?: string;
}

export enum GroupTransferTargetStatus {
  InvalidIdentifier = "InvalidIdentifier",
  Ok = "Ok",
  Unregistered = "Unregistered",
  BlockedAccount = "BlockedAccount",
  InvalidAmount = "InvalidAmount",
}

export interface GroupTransferTargetValidationInput {
  amount: number;
  description?: string;
  identifier?: string;
}

export interface GroupTransferQuery {
  amount: number;
  description?: string;
  userAccountName?: string;
  userDisplayName?: string;
  voucherId: number;
  createDate: string;
  createDateDisplay?: string;
  targets?: GroupTransferTargetQuery[];
}

export interface GroupTransferTargetQuery {
  accountName?: string;
  amount: number;
  description?: string;
  userDisplayName?: string;
  userPhoneNumber?: string;
}

export interface GroupTransferInput {
  userAccountId: number;
  totalAmount: number;
  description?: string;
  targets?: GroupTransferTargetInput[];
}

export interface GroupTransferTargetInput {
  amount: number;
  description?: string;
  identifier?: string;
}

export interface ImportantActionApiModel {
  id: number;
  createTime: string;
  createTimeDisplay?: string;
  type: NotificationType;
  level: NotificationLevel;
  closeable: boolean;
  dismissible: boolean;
  title?: string;
  text?: string;
  dataId?: string;
  data?: string;
}

export enum NotificationType {
  Default = "Default",
  EPayRequestUnpaid = "EPayRequestUnpaid",
  EPayRequestPaid = "EPayRequestPaid",
  UserIdentityUnknown = "UserIdentityUnknown",
  UserIdentityApproved = "UserIdentityApproved",
  UserIdentityRejected = "UserIdentityRejected",
  UpgradeToBusinessApproved = "UpgradeToBusinessApproved",
  UpgradeToBusinessRejected = "UpgradeToBusinessRejected",
  UserBankApproved = "UserBankApproved",
  UserBankRejected = "UserBankRejected",
  SubUserInvitationApproved = "SubUserInvitationApproved",
  SubUserInvitationRejected = "SubUserInvitationRejected",
  SubUserInvitationSent = "SubUserInvitationSent",
}

export enum NotificationLevel {
  Unknown = "Unknown",
  Default = "Default",
  Success = "Success",
  Info = "Info",
  Warning = "Warning",
  Danger = "Danger",
}

export interface PluginApiModel {
  id: number;
  name?: string;
  amountCalculationExpression?: string;
  logoFileName?: string;
  logoFileUniqueId?: string;
  logoFileUrl?: string;
  properties?: PluginPropertyApiModel[];
}

export interface PluginPropertyApiModel {
  name?: string;
  title?: string;
  fieldType: FieldDisplayType;
  isRequired: boolean;
  value?: string;
  currencyName?: string;
  isFilterable: boolean;
  description?: string;
}

export enum FieldDisplayType {
  String = "String",
  Text = "Text",
  Currency = "Currency",
  Integer = "Integer",
  Float = "Float",
  Boolean = "Boolean",
  List = "List",
}

export interface PosLandingPageApiModel {
  domainId: number;
  domainEnglishName?: string;
  domainPersianName?: string;
  domainLogoFileName?: string;
  domainLogoFileUniqueId?: string;
  domainLogoFileUrl?: string;
  accountNumber?: string;
  getCommissionFromPayer?: boolean;
  userId: string;
  userDisplayName?: string;
  userAvatarFileName?: string;
  userAvatarFileUniqueId?: string;
  userAvatarFileUrl?: string;
  subUserId?: string;
  subUserDisplayName?: string;
  subUserAvatarFileName?: string;
  subUserAvatarFileUniqueId?: string;
  subUserAvatarFileUrl?: string;
}

export interface ReceiptApiModel {
  amount: number;
  callbackUrl?: string;
  createdDate: string;
  createDateDisplay?: string;
  description?: string;
  id: number;
  type: EpayRequestType;
  typeDisplay?: string;
  token?: string;
  shareUrl?: string;
  failed: boolean;
  failureMessage?: string;
  payerUserAccountId?: number;
  payerUserAccountName?: string;
  payerUserAccountNumber?: string;
  targetUserDisplayName?: string;
  audiences?: ReceiptAudienceApiModel[];
}

export enum EpayRequestType {
  Link = "Link",
  POS = "POS",
  Share = "Share",
  ShareWithBlock = "ShareWithBlock",
  Charge = "Charge",
}

export interface ReceiptAudienceApiModel {
  fullName?: string;
  contact?: string;
}

export interface PosWalletPayInput {
  userAccountId: number;
  amount: number;
  description?: string;
  subUserId?: string;
}

export interface PosOnlinePayInput {
  terminalId: string;
  subuserId?: string;
  amount: number;
  description?: string;
}

export interface ResellerApiModel {
  startDate: string;
  startDateDisplay?: string;
  endDate: string;
  endDateDisplay?: string;
  isActive: boolean;
  commissionId: number;
  commissionDisplay?: string;
  commissionName?: string;
  commissionType: ComissionType;
  commissionTypeDisplay?: string;
  commissionPercent?: number;
  commissionFixedValue?: number;
  commissionMaxValue?: number;
  introduceLink?: string;
  hasSubDomain: boolean;
}

export enum ComissionType {
  Percentage = "Percentage",
  Fixed = "Fixed",
}

export interface ReselledUserFilterData {
  identityStatuses?: undefined;
}

export interface DropDownResultOfIdentityStatus {
  items?: DropDownResultItemOfIdentityStatus[];
}

export interface DropDownResultItemOfIdentityStatus {
  value: IdentityStatus;
  display?: string;
}

export enum IdentityStatus {
  None = "None",
  WatingForCheck = "WatingForCheck",
  Checking = "Checking",
  EditingRequired = "EditingRequired",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface ReselledUserApiModel {
  userId: string;
  displayName?: string;
  phoneNumber?: string;
  registerDate?: string;
  isPerson: boolean;
  identityStatus: IdentityStatus;
  identityStatusDisplay?: string;
  isActive: boolean;
  lastActivityDate?: string;
}

export interface ReselledUserActivityApiModel {
  commissionsPaidToResellerCount: number;
  commissionsPaidToResellerSum: number;
  generatedLinks: number;
  paidGeneratedLinks: number;
}

export interface AggregationReportQueryOfDecimal {
  value: number;
}

export interface DateReportQueryOfDecimal {
  key: number;
  label?: string;
  value: number;
  day: number;
  dayName?: string;
  month: number;
  monthName?: string;
  year: number;
}

export interface AggregationReportQueryOfInteger {
  value: number;
}

export interface DateReportQueryOfInteger {
  key: number;
  label?: string;
  value: number;
  day: number;
  dayName?: string;
  month: number;
  monthName?: string;
  year: number;
}

export interface EpayRequestWcfResult {
  requestToken?: string;
  paymentUrl?: string;
}

export interface EpayRequestServiceInput {
  userId: string;
  amount: number;
  invoiceNumber?: string;
  invoiceDate: string;
  expiresAfterDays: number;
  description?: string;
  callbackUrl?: string;
  isAutoRedirect: boolean;
  domainId: number;
  terminalId: string;
  userAccountId: number;
  isAutoConfirm: boolean;
  callbackType: CallbackType;
  audiences?: EPayRequestAudienceInput[];
  getComissionFromPayer: boolean;
}

export interface EpayRequestCheckStatusResult {
  requestStatus: EpayRequestStatus;
  bankReferenceId?: string;
  verifyDate?: string;
}

export interface DivideEpayRequestServiceInput {
  amount: number;
  divisions?: DivideEpayRequestShareModel[];
  invoiceNumber?: string;
  invoiceDate: string;
  expiresAfterDays: number;
  description?: string;
  callBackUrl?: string;
  isAutoRedirect: boolean;
  isBlocking: boolean;
}

export interface DivideEpayRequestShareModel {
  apiKey?: string;
  amount: number;
  dividerAmount: number;
  invoiceNumber?: string;
}

export interface DividedEpayRequestUnblockResult {
  unblockedAmount: number;
}

export interface DividedEpayRequestUnblockInput {
  paymentToken?: string;
  userApiKey?: string;
  invoiceNumber?: string;
  dividerAmount: number;
  userAmount: number;
  description?: string;
}

export interface DividedEpayRequestCancelResult {
  cancelledAmount: number;
}

export interface DividedEpayRequestCancelInput {
  paymentToken?: string;
  userApiKey?: string;
  invoiceNumber?: string;
  dividerAmount: number;
  userAmount: number;
  shebaNo?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
}

export interface SubDomainApiModel {
  domainId: number;
  persianName?: string;
  englishName?: string;
  subDomainAddress?: string;
  resellerUserId: string;
  isActive: boolean;
  logoFileUniqueId?: string;
  logoFileName?: string;
  logoFileUrl?: string;
  domainPersianName?: string;
  domainEnglishName?: string;
  resellerUserDisplayName?: string;
  about?: string;
}

export interface SubDomainUpdateApiModel {
  logoFileUniqueId?: string;
  about?: string;
}

export interface BusinessUserConnectionQuery {
  businessId: string;
  businessAvatarUrl?: string;
  businessName?: string;
  connectDate?: string;
  disconnectDate?: string;
  subUserConnectionStatus: SubUserConnectionStatus;
  connectionId?: number;
}

export interface SubUserAccountDetailQuery {
  id: number;
  name?: string;
  accountNumber?: string;
  accountStatus: AccountStatus;
  accountStatusDisplay?: string;
  isActive: boolean;
  accountQrCodeUrl?: string;
  notificationEnabled: boolean;
  posScanCount: number;
  posPaidCount: number;
  posLinkUrl?: string;
  canReceiveMoney: boolean;
  canTransferMoney: boolean;
  canSeeEpayRequests: boolean;
  canSeeTransactions: boolean;
  canRequestSettlement: boolean;
  canChargeAccount: boolean;
  canSeeSettlementRequests: boolean;
}

export enum AccountStatus {
  Block = "Block",
  OK = "OK",
}

export interface SubUserNotificationStatusInput {
  notificationEnabled: boolean;
}

export interface TransactionApiModel {
  id: number;
  accountId: number;
  accountTitle?: string;
  accountNumber?: string;
  amount: number;
  createDateTime: string;
  createDate?: string;
  description?: string;
  remain: number;
  transactionType: TransactionType;
  transactionTypeDisplay?: string;
  transactionOperationType: TransactionOperationType;
  transactionOperationTypeDisplay?: string;
  targetBusinessCategoryId?: number;
  targetBusinessCategoryName?: string;
  operationId?: number;
  voucherId: number;
}

export enum TransactionType {
  Debt = "Debt",
  Credit = "Credit",
}

export enum TransactionOperationType {
  Normal = "Normal",
  ResellerCommission = "ResellerCommission",
}

export interface UserBankQuery {
  id: number;
  identityType: BusinessShareType;
  bankId: number;
  bankName?: string;
  bankLogo?: string;
  accountNumber?: string;
  shebaNo?: string;
  firstName?: string;
  lastName?: string;
  status: IdentityStatus;
  statusDescription?: string;
  isVisible: boolean;
  name?: string;
}

export enum BusinessShareType {
  Person = "Person",
  PrivateStock = "PrivateStock",
  PublicStock = "PublicStock",
  Limited = "Limited",
  GeneralPartnership = "GeneralPartnership",
  Institute = "Institute",
  Cooperative = "Cooperative",
}

export interface UserBankDetailQuery extends UserBankQuery {
  nationalCode?: string;
  documents?: DocumentQuery[];
}

export interface DocumentQuery {
  uniqueId: string;
  fileName?: string;
  fileSize: number;
  fileTypes: FileTypes;
  createDate?: string;
  documentContentType: DocumentContentType;
  fileUrl?: string;
}

export enum FileTypes {
  Other = "Other",
  Image = "Image",
  Pdf = "Pdf",
}

export enum DocumentContentType {
  Other = "Other",
  UserBankVerification = "UserBankVerification",
  IdentityCard = "IdentityCard",
  BusinessStatute = "BusinessStatute",
  BusinessLatestChangesAnnouncement = "BusinessLatestChangesAnnouncement",
  BusinessOwnersIdentityCards = "BusinessOwnersIdentityCards",
  BusinessOwnersBirthCertificates = "BusinessOwnersBirthCertificates",
}

export interface UserBankInput {
  name?: string;
  identityType?: undefined;
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  bankId?: number;
  accountNumber?: string;
  shebaNo?: string;
  documents?: DocumentInput[];
  isVisible?: boolean;
}

export interface DocumentInput {
  fileUniqueId: string;
  documentContentType: DocumentContentType;
}

export interface UserBankChangeVisibilityInput {
  isVisible?: boolean;
}

export interface UserDetailQuery extends UserMeQuery {
  nationalCode?: string;
  state?: string;
  city?: string;
  address?: string;
  phoneNumber?: string;
  introducedBySubDomain?: string;
}

export interface UserMeQuery {
  userId: string;
  title?: string;
  profileImageLink?: string;
  identityStatus: IdentityStatus;
  isBusinessUser: boolean;
  isResellerUser: boolean;
  isSubUser: boolean;
  shareCode: number;
  referredBy?: string;
  businessName?: string;
  businessUserId?: string;
}

export interface UserProfileInput {
  state?: string;
  city?: string;
  address?: string;
}

export interface UserProfileAvatarInput {
  fileUniqueId?: string;
}

export interface NewUserIdentityRequestInput {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  documents?: DocumentInput[];
}

export interface UserIdentityRequestQuery {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  documents?: DocumentQuery[];
  userIdentityRequestStatus: IdentityStatus;
  userIdentityRequestStatusDescription?: string;
}

export interface UserChangePhoneNumberInput {
  phoneNumber?: string;
}

export interface UserVerifyChangePhoneNumberInput {
  token?: string;
  phoneNumber?: string;
}

export interface UserChangePasswordInput {
  currentPassword?: string;
  newPassword?: string;
}

export interface UpgradeToBusinessUserQuery {
  businessName?: string;
  organizationName?: string;
  businessLogoImageLink?: string;
  businessLogoImageUniqueId?: string;
  organizationNationalCode?: string;
  businessType: BusinessType;
  userIdentityType: BusinessShareType;
  upgradeToBusinessRequestStatus: IdentityStatus;
  upgradeToBusinessRequestStatusDescription?: string;
  managerName?: string;
  managerPhoneNumber?: string;
  phoneNumber?: string;
  faxNumber?: string;
  webSiteUrl?: string;
  email?: string;
  state?: string;
  city?: string;
  address?: string;
  personNationalCode?: string;
  documents?: DocumentQuery[];
}

export interface UpgradeToBusinessUserInput {
  logoFileUniqueId?: string;
  businessName?: string;
  organizationName?: string;
  organizationNationalCode?: string;
  businessType?: undefined;
  userIdentityType?: undefined;
  managerName?: string;
  managerPhoneNumber?: string;
  phoneNumber?: string;
  faxNumber?: string;
  webSiteUrl?: string;
  email?: string;
  state?: string;
  city?: string;
  address?: string;
  documents?: DocumentInput[];
}

export interface SubuserInvitationTaskInput {
  subuserInvitationTaskType: SubuserInvitationTaskType;
}

export enum SubuserInvitationTaskType {
  Accept = "Accept",
  Reject = "Reject",
}

export interface SubUserInvitationQuery {
  invitationId: number;
  businessUserAvatarUrl?: string;
  businessUserTitle?: string;
  message?: string;
  invitationDate?: string;
}

export interface UserWorkspaceQuery {
  businessUserId: string;
  businessAvatarUrl?: string;
  businessName?: string;
  positionTitle?: string;
  workspaceType: WorkspaceType;
}

export enum WorkspaceType {
  User = "User",
  SubUser = "SubUser",
}

export interface UserPluginInfoApiModel {
  id: number;
  isActive: boolean;
  userId: string;
  userDisplayName?: string;
  pluginId: number;
  pluginName?: string;
  pluginConfig?: string;
  pluginAmountCalculationExpression?: string;
  pluginLogoFileName?: string;
  pluginLogoFileUniqueId?: string;
  pluginLogoFileUrl?: string;
  properties?: PluginPropertyApiModel[];
}

export interface UserPluginApiModel {
  id: number;
  userId: string;
  userDisplayName?: string;
  isActive: boolean;
  pluginConfig?: string;
  pluginName?: string;
}

export interface UserPluginTogggleApiModel {
  isActive: boolean;
}
