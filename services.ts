/** Get user accounts [Or get sub user authorized accounts] */
export function getAccount() {}

/** Create a new account. [Feature is not allowed for sub users] */
export function postAccount() {}

/** Get user account detail [Feature is not allowed for sub users] */
export function getAccountId(id: number) {}

/** Edit user account [Feature is not allowed for sub users] [Needs secure login] */
export function putAccountId(id: number) {}

/**
 * Edit user account notification status [Feature is not allowed for sub users]
 * [Needs secure login]
 */
export function putAccountIdNotification(id: number) {}

/** Get user account balance */
export function getAccountIdBalance(id: number) {}

/** Undefined */
export function getAccountAccountIdPermittedSubUsers(accountId: number) {}

/** Create a new account charge request */
export function postAccountIdCharge(id: number) {}

/** Get comission amount for epay request amount */
export function getAccountIdEpayRequestComission(
  id: number,
  queryParams: { amount: number }
) {}

/** Create a new epay request */
export function postAccountIdEpayRequest(id: number) {}

/** Get comission amount for settlement request amount */
export function getAccountIdSettlementRequestComission(
  id: number,
  queryParams: { amount: number }
) {}

/** Create a new settlement request [Needs secure login] */
export function postAccountIdSettlementRequest(id: number) {}

/** Get insensitive data of account owner */
export function getAccountSearch(queryParams: {
  userId: string;
  accountId: number;
  customerNumber: number;
  accountNumber: string;
  contact: string;
}) {}

/** Get comission amount for transfer money amount */
export function getAccountIdTransferMoneyCommission(
  id: number,
  queryParams: { amount: number }
) {}

/** Transfer money */
export function postAccountIdTransferMoney(id: number) {}

/** SiginIn using ApiKey and SecretKey */
export function postAuthApilogin() {}

/** Sign in and get a new long-lived JWT */
export function postAuthLogin() {}

/** Undefined */
export function postAuthLoginOtp() {}

/** Undefined */
export function postAuthLoginOtpGenerate() {}

/** Sign in as a sub user (JWT) */
export function postAuthLoginSubuser() {}

/** Get a new short-lived JWT, using current long-lived one */
export function postAuthLoginSecurity() {}

/** Refresh the short-lived JWT, using current short-lived one */
export function getAuthLoginSecurityRefresh() {}

/** Check the data that the user has been logged in */
export function postAuthCheck() {}

/** Log out */
export function postAuthLogout() {}

/** Register new user with the phone number (Two factor authentication) */
export function postAuthRegister() {}

/** Confirm the phone number with verification code */
export function postAuthRegisterVerify() {}

/** Confirm phone number with the given token and auto signin user to app. */
export function postAuthRegisterPoslogin() {}

/** Set basic data for your registration [fullname, password] */
export function postAuthRegisterBasic() {}

/** Recover forgotten password with phone number (Two factor authentication) */
export function postAuthForgetPassword() {}

/** Confirm the phone number with a verification code for recover password */
export function postAuthForgetPasswordVerify() {}

/** Reset forgotten password */
export function postAuthForgetPasswordResetPassword() {}

/** Register new Device for current user. */
export function postAuthRegisterDevice() {}

/** Get available banks */
export function getBank() {}

/** Get Business categories */
export function getBusinessUserCategory() {}

/**
 * Send a connection request to sub user [Feature just allowed for the business
 * users]
 */
export function postBusinessUserInvite() {}

/**
 * Resend Connection Request to Sub-User [Feature just allowed for the business
 * users]
 */
export function postBusinessUserInviteInvitationIdResend(
  invitationId: number
) {}

/**
 * Remove an invitation [Feature just allowed for the business users] [Needs
 * secure login]
 */
export function deleteBusinessUserInviteInvitationIdRemove(
  invitationId: number
) {}

/**
 * Resend Connection Request to Sub-User [Feature just allowed for the business
 * users]
 */
export function postBusinessUserResendInvitationId(invitationId: number) {}

/**
 * Remove an invitation [Feature just allowed for the business users] [Needs
 * secure login]
 */
export function deleteBusinessUserConnectionInvitationIdRemove(
  invitationId: string,
  queryParams: { id: number }
) {}

/** Get the connections [Feature just allowed for the business users] */
export function getBusinessUserConnection(queryParams: {
  subUserConnectionStatus: undefined;
  skip: number;
  take: number;
}) {}

/**
 * Get active connections ordered by Transactions count [Feature just allowed for
 * the business users]
 */
export function getBusinessUserConnectionActive(queryParams: {
  skip: number;
  take: number;
}) {}

/**
 * Get the connection amounts report [Feature just allowed for the business users]
 * [Needs secure login]
 */
export function getBusinessUserConnectionId(id: number) {}

/**
 * Change sub user connection info [Feature just allowed for the business users]
 * [Needs secure login]
 */
export function putBusinessUserConnectionId(id: number) {}

/**
 * Disconnect sub user connection [Feature just allowed for the business users]
 * [Needs secure login]
 */
export function deleteBusinessUserConnectionId(id: number) {}

/**
 * Get sub user permissions for accounts [Feature just allowed for the business
 * users] [Needs secure login]
 */
export function getBusinessUserConnectionIdPermission(id: number) {}

/**
 * Set access to the account for sub user [Feature just allowed for the business
 * users] [Needs secure login]
 */
export function postBusinessUserConnectionIdPermission(id: number) {}

/**
 * Edit sub user permission for the account [Feature just allowed for the business
 * users] [Needs secure token]
 */
export function putBusinessUserConnectionIdPermissionAccountId(
  id: number,
  accountId: number
) {}

/**
 * Remove access to the account for sub user [Feature just allowed for the
 * business users] [Needs secure token]
 */
export function deleteBusinessUserConnectionIdPermissionAccountId(
  id: number,
  accountId: number
) {}

/**
 * Get EPay Requests created by SubUser [Feature just allowed for the business
 * users] [Needs secure login]
 */
export function getBusinessUserConnectionIdEpay(
  id: number,
  queryParams: {
    accountId: number;
    epayRequestStatus: undefined;
    startDate: string;
    endDate: string;
    pluginId: number;
    plugin_ZhenicCustomerName: string;
    plugin_ZhenicCustomerNumber: string;
    plugin_ZhenicInvoiceNumber: string;
    plugin_ZhenicRialAmount: string;
    plugin_ZhenicDollarAmount: string;
    plugin_ZhenicDollarAmountRate: string;
    plugin_ZhenicEuroAmount: string;
    plugin_ZhenicEuroAmountRate: string;
    plugin_SepidarCustomerName: string;
    plugin_SepidarCustomerNumber: string;
    plugin_SepidarDocumentNumber: string;
    plugin_SepidarVoucherType: string;
    skip: number;
    take: number;
  }
) {}

/**
 * Get Settlement Requests created by a SubUser [Feature just allowed for the
 * business users] [Needs secure login]
 */
export function getBusinessUserConnectionIdSettlement(
  id: number,
  queryParams: {
    accountId: number;
    startDate: string;
    endDate: string;
    minimumAmount: number;
    maximumAmount: number;
    skip: number;
    take: number;
  }
) {}

/**
 * Get user pay requests (and sub user authorized accounts pay requests) [Needs
 * secure login]
 */
export function getEpayRequest(queryParams: {
  accountId: number;
  epayRequestStatus: undefined;
  startDate: string;
  endDate: string;
  pluginId: number;
  plugin_ZhenicCustomerName: string;
  plugin_ZhenicCustomerNumber: string;
  plugin_ZhenicInvoiceNumber: string;
  plugin_ZhenicRialAmount: string;
  plugin_ZhenicDollarAmount: string;
  plugin_ZhenicDollarAmountRate: string;
  plugin_ZhenicEuroAmount: string;
  plugin_ZhenicEuroAmountRate: string;
  plugin_SepidarCustomerName: string;
  plugin_SepidarCustomerNumber: string;
  plugin_SepidarDocumentNumber: string;
  plugin_SepidarVoucherType: string;
  skip: number;
  take: number;
}) {}

/** Get epay request detail based on Id */
export function getEpayRequestId(id: number) {}

/** Get QR code image file for epay request */
export function getEpayRequestTokenQrCode(token: string) {}

/** Undefined */
export function getEpayRequestPosQrAccountNo(
  accountNo: string,
  queryParams: { amount: number; subUserConId: number }
) {}

/**
 * Get pay requests that the user is one of its audiences. [Feature is not allowed
 * for sub users] [Needs secure login]
 */
export function getEpayRequestForMe(queryParams: {
  applicantName: string;
  startDate: string;
  endDate: string;
  epayRequestStatus: undefined;
  skip: number;
  take: number;
}) {}

/** Create a new task for executing the actions of epay request [Resend/Cancel] */
export function postEpayRequestIdTask(id: number) {}

/** Undefined */
export function getEpayRequestAudiencesRecent() {}

/** Upload new file [Allowed files are images and pdf / Max Size: 3 MB] */
export function postFile() {}

/** Download a file. */
export function getFileId(id: string) {}

/** For Business users only] */
export function putGroupTransferAdd() {}

/** For Business users only] */
export function postGroupTransferImport() {}

/** For Business users only] */
export function postGroupTransferExport() {}

/** For Business users only] */
export function postGroupTransferTransfer() {}

/** Get commission amount for group transfer [for Business users only] */
export function getGroupTransferCommission(queryParams: {
  accountId: number;
  amount: number;
}) {}

/** Undefined */
export function getNotificationIa() {}

/** Undefined */
export function putNotificationIaNotifId(notifId: number) {}

/** Undefined */
export function getPluginId(id: number) {}

/** Get epay request detail */
export function getPosAccountNo(
  accountNo: string,
  queryParams: { subUserConId: number }
) {}

/** Pay POS link with Wallet */
export function postPosPayTargetAccountNoWallet(targetAccountNo: string) {}

/** Pay POS link Online */
export function postPosPayTargetAccountNoOnline(targetAccountNo: string) {}

/** Get a receipt by it's id */
export function getReceiptToken(token: string) {}

/**
 * Get the Resellership info of current Reseller user [Feature just allowed for
 * Resellers]
 */
export function getResellerUser() {}

/**
 * Get filter data items to populate DropDowns [Feature just allowed for
 * Resellers]
 */
export function getResellerUserIntroducedFilterData() {}

/**
 * Get the Users Introduced by current Reseller user [Feature just allowed for
 * Resellers]
 */
export function getResellerUserIntroduced(queryParams: {
  searchInput: string;
  isActive: boolean;
  isPerson: boolean;
  identityStatuses: undefined;
  lastActivityFrom: string;
  lastActivityTo: string;
  registeredFrom: string;
  registeredTo: string;
  skip: number;
  take: number;
  orderBy: string;
  orderDesc: boolean;
}) {}

/** Get the User activity [Feature just allowed for Resellers] */
export function getResellerUserIntroducedUserIdActivity(userId: string) {}

/**
 * Get sum of all commissions paid to current Reseller user [Feature just allowed
 * for Resellers]
 */
export function getResellerUserDashboardCommissionSum(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get the time-based report of commissions paid to current Reseller user [Feature
 * just allowed for Resellers]
 */
export function getResellerUserDashboardCommissionReport(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get count of all links generated by users, who are introduced by current
 * Reseller user [Feature just allowed for Resellers]
 */
export function getResellerUserDashboardLinksCount(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get time-based report of links generated by users, who are introduced by
 * current Reseller user [Feature just allowed for Resellers]
 */
export function getResellerUserDashboardLinksReport(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get count of all paid links generated by users, who are introduced by current
 * Reseller user [Feature just allowed for Resellers]
 */
export function getResellerUserDashboardLinksPaidCount(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get time-based report of paid links generated by users, who are introduced by
 * current Reseller user [Feature just allowed for Resellers]
 */
export function getResellerUserDashboardLinksPaidReport(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get count of all commission transactions, paid to current Reseller user
 * [Feature just allowed for Resellers]
 */
export function getResellerUserDashboardTransactionsCount(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get time-based report of commission transactions, paid to current Reseller user
 * [Feature just allowed for Resellers]
 */
export function getResellerUserDashboardTransactionsReport(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get count of all users reselled by current Reseller user [Feature just allowed
 * for Resellers]
 */
export function getResellerUserDashboardIntroducedCount(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/**
 * Get time-based report of users reselled by current Reseller user [Feature just
 * allowed for Resellers]
 */
export function getResellerUserDashboardIntroducedReport(queryParams: {
  month: number;
  year: number;
  takeDays: number;
  takeMonths: number;
  takeYears: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}) {}

/** Create an new [EpayRequest] with the given model. */
export function postServiceNewEpayRequest() {}

/** Check the [EpayRequest] based on token */
export function postServiceCheckEpayRequest() {}

/** Verify the ApiKey for authorizing the [User] */
export function postServiceVerifyApiKey() {}

/** Create a Divided [EpayRequest] for the given model. */
export function postServiceNewDivideEpayRequest() {}

/** Unblock Amount of an Divided[EpayRequest] */
export function postServiceUnblockAmount() {}

/** Cancel Amount of an Divided[EpayRequest] */
export function postServiceCancelAmount() {}

/** Set [EPayRequest] status to 'Cancel' and cancel the payment */
export function postServiceCancelPayment() {}

/**
 * Get user settlement requests (or sub user authorized accounts settlement
 * requests)
 */
export function getSettlementRequest(queryParams: {
  accountId: number;
  startDate: string;
  endDate: string;
  minimumAmount: number;
  maximumAmount: number;
  skip: number;
  take: number;
}) {}

/** Get info of a SubDomain by it's address. */
export function getSubDomainSubDomainAddress(subDomainAddress: string) {}

/** Get the SubDomain of current Reseller user [Feature just allowed for Resellers] */
export function getSubDomain() {}

/**
 * Update the SubDomain of current Reseller user [Feature just allowed for
 * Resellers]
 */
export function putSubDomain() {}

/**
 * Disconnect business user connection [Feature just allowed for the sub users]
 * [Needs secure login]
 */
export function deleteSubUserConnectionId(id: number) {}

/** Get the connections [Feature just allowed for the sub users] */
export function getSubUserConnection() {}

/** Undefined */
export function getSubUserAccountId(id: number) {}

/**
 * Enables/Disables sending notifications to current SubUser for transactions on
 * specified Account [allowed for the SubUsers only]
 */
export function postSubUserNotificationId(id: number) {}

/**
 * Get user account transactions (sub user authorized accounts transactions)
 * [Needs secure login]
 */
export function getTransaction(queryParams: {
  accountId: number;
  transactionType: undefined;
  startDate: string;
  endDate: string;
  limit: number;
  take: number;
}) {}

/** Get insensitive data of account owner */
export function getTransferSearch(queryParams: {
  userId: string;
  accountId: number;
  customerNumber: number;
  accountNumber: string;
  contact: string;
}) {}

/** Get recent money transfers */
export function getTransferRecent(queryParams: { take: number }) {}

/** Get commission amount for transfer money amount */
export function getTransferAccountIdCommission(
  accountId: number,
  queryParams: { amount: number }
) {}

/** Transfer money */
export function postTransferAccountId(accountId: number) {}

/** Get user banks [Feature is not allowed for sub users.] */
export function getUserBank() {}

/**
 * Create a new user bank [Feature is not allowed for sub users] [Needs secure
 * login]
 */
export function postUserBank() {}

/** Get available user banks [Feature is not allowed for sub users.] */
export function getUserBankReady() {}

/** Get user bank detail [Needs secure login] */
export function getUserBankId(id: number) {}

/** Edit user bank [Needs secure login] */
export function putUserBankId(id: number) {}

/** Change user bank show-in-list property [Needs secure login] */
export function putUserBankIdChangeVisibility(id: number) {}

/** Get [normal/sub/business] user profile detail */
export function getUser() {}

/**
 * Edit profile [state, city, address] [Feature is not allowed for business users]
 * [Needs secure login]
 */
export function putUser() {}

/** Undefined */
export function getUserContactInput(input: string) {}

/** Change user avatar [Needs secure login] */
export function putUserChangeAvatar() {}

/**
 * Create a new national id verification request [Feature is not allowed for
 * business users]
 */
export function postUserIdentityRequest() {}

/**
 * Get last national id verification request [Feature is not allowed for business
 * users]
 */
export function getUserIdentityRequest() {}

/** Change user phone number [Needs secure login] */
export function postUserChangePhoneNumber() {}

/** Confirm the phone number with a verification code for change phone number */
export function postUserChangePhoneNumberVerify() {}

/** Change user password */
export function postUserChangePassword() {}

/** Get user profile summary */
export function getUserMe() {}

/**
 * Request for upgrade account to the business [Feature just allowed for the
 * normal users]
 */
export function postUserUpgradeToBusinessRequest() {}

/**
 * Get Last Request for upgrade account to the business [Feature just allowed for
 * the normal users]
 */
export function getUserUpgradeToBusinessRequest() {}

/**
 * Create a new task for executing the actions of the business user invitation
 * [Accept/Reject] [Feature is not allowed for sub users]
 */
export function postUserInvitationIdTask(id: number) {}

/** Get business user invitations for me [Feature is not allowed for sub users] */
export function getUserInvitation() {}

/** Get user workspaces [Feature is not allowed for sub users] */
export function getUserWorkspace() {}

/** Undefined */
export function getUserPlugin() {}

/** Undefined */
export function putUserPluginIdChangeStatus(id: number) {}

export interface AccountSummaryWithBalanceQuery {
  id: number;
  title: string;
  number: string;
  isActive: boolean;
  intermediateUserBankBankId: number;
  intermediateUserBankBankName: string;
  intermediateUserBankAccountNumber: string;
  intermediateUserBankShebaNumber: string;
  directUserBankBankId: number;
  directUserBankBankName: string;
  directUserBankAccountNumber: string;
  directUserBankShebaNumber: string;
  relatedUserAccountIndex: number;
  getComissionFromPayer: boolean;
  totalBalance: number;
  realBalance: number;
}

export enum CurrencyType {
  Rial = "Rial",
}

export interface ActionPolicyCommissionDetailQuery {
  title: string;
  value: string;
}

export interface AccountInput {
  title: string;
  isActive: boolean;
  userBankId: number;
  getComissionFromPayer: boolean;
  automaticSettlement: boolean;
  currencyType: undefined;
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
  subUserTitle: string;
  subUserPositionTitle: string;
  subUserContact: string;
  connectDate: string;
  disconnectDate: string;
  subuserStatus: SubuserStatus;
  subUserConnectionStatus: SubUserConnectionStatus;
  subuserStatusDisplay: string;
  subUserAvatarUrl: string;
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
  paymentLink: string;
}

export interface NewChargeRequestInput {
  amount: number;
  callbackUrl: string;
}

export interface CommissionApiModel {
  comissionAmount: number;
  commissionAmount: number;
}

export interface NewEpayRequestResultQuery {
  id: number;
  token: string;
  createDate: string;
  pluginName: string;
  pluginId: number;
  amount: number;
  userAccountId: number;
  userAccountName: string;
  expireDate: string;
  getComissionByPayer: boolean;
  comissionAmount: number;
  paymentLink: string;
  qrCodeLink: string;
  epayRequestStatus: EpayRequestStatus;
  description: string;
  epayRequestAudience: undefined;
  epayRequestPluginSpecific: undefined;
}

export enum EpayRequestStatus {
  Initiated = "Initiated",
  Paid = "Paid",
  Cancelled = "Cancelled",
  Expired = "Expired",
  Viewed = "Viewed",
}

export interface EPayRequestAudienceInput {
  fullName: string;
  contact: string;
}

export interface EpayRequestPluginSpecificOutput {
  pluginPropertyName: string;
  pluginPropertyPersianName: string;
  pluginPropertyId: string;
  value: string;
}

export interface NewEpayRequestInput {
  amount: number;
  expireDays: number;
  isAutoConfirm: boolean;
  callbackUrl: string;
  callbackType: undefined;
  description: string;
  invoiceNumber: string;
  invoiceDate: string;
  audiences: undefined;
  pluginId: number;
  pluginSpecifics: undefined;
  getComissionByPayer: boolean;
}

export enum CallbackType {
  None = "None",
  Redirect = "Redirect",
  RedirectWithPost = "RedirectWithPost",
  Call = "Call",
}

export interface EpayRequestPluginSpecificInput {
  pluginPropertyId: string;
  value: string;
}

export interface SettlementRequestQuery {
  id: number;
  accountId: number;
  accountName: string;
  accountNumber: string;
  bankId: number;
  bankName: string;
  createDate: string;
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
  description: string;
}

export interface InsensitiveAccountApiModel {
  accountId: number;
  accountOwnerTitle: string;
  accountOwnerAvatarUrl: string;
}

export interface TransferMoneyApiModel {
  id: number;
  amount: number;
  domainCommissionAmount: number;
  description: string;
  targetAccountId: number;
  targetAccountNumber: string;
  targetUserDisplayName: string;
  targetUserAvatarUrl: string;
  createdDate: string;
  createdDateTime: string;
  userAccountId: number;
  userAccountName: string;
}

export interface TransferMoneyInput {
  targetUserAccountId: number;
  amount: number;
  description: string;
}

export interface NewTokenResult {
  token: string;
  expires: number;
  mustChangePassword: boolean;
}

export interface ApiLoginInput {
  secretKey: string;
  apiKey: string;
}

export interface LoginInput {
  userName: string;
  password: string;
}

export interface TotpLoginInput {
  phoneNumber: string;
  token: string;
}

export interface RequestTotpInput {
  phoneNumber: string;
}

export interface SubUserLoginInput {
  businessId: string;
}

export interface SecureLoginInput {
  password: string;
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
  phoneNumber: string;
  deviceId: string;
  deviceBrandName: string;
  deviceOsVersion: string;
}

export interface ConfirmPhoneNumberQuery {
  token: string;
}

export interface ConfirmPhoneNumberOrEmailInput {
  userId: string;
  token: string;
  subDomainId: string;
}

export interface SetUserBasicInfoInput {
  userId: string;
  token: string;
  password: string;
  fullName: string;
  introducerCode: string;
}

export interface UserForgetPasswordInput {
  phoneNumber: string;
}

export interface UserVerifyForgetPasswordInput {
  phoneNumber: string;
  token: string;
}

export interface UserResetForgetPasswordInput {
  phoneNumber: string;
  token: string;
  newPassword: string;
}

export interface RegisterDeviceInput {
  deviceId: string;
  deviceBrandName: string;
  deviceOsVersion: string;
  deviceToken: string;
}

export interface BankQuery {
  id: number;
  name: string;
  logoUrl: string;
}

export interface BusinessCategoryQuery {
  id: BusinessType;
  title: string;
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
  connectDate: string;
  disconnectDate: string;
  requestDate: string;
  removeDate: string;
  subUserAvatarUrl: string;
  subUserTitle: string;
  subUserContact: string;
  subUserPositionTitle: string;
  subUserConnectionStatus: SubUserConnectionStatus;
  connectionId: number;
}

export interface SendConnectionRequestInput {
  phoneNumber: string;
  email: string;
  position: string;
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
  position: string;
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
  accountId: number;
}

export interface EditSubUserPermissionInput {
  subUserPermissionType: undefined;
  isEnabled: boolean;
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
  createDate: string;
  createDateTime: string;
  expireDate: string;
  expireDateTime: string;
  payDate: string;
  payDateTime: string;
  amount: number;
  description: string;
  userAccountId: number;
  userAccountName: string;
  paymentLink: string;
  qrCodeLink: string;
  epayRequestStatus: EpayRequestStatus;
  epayRequestAudience: undefined;
}

export interface EpayRequestForUserQuery {
  id: number;
  applicantName: string;
  expireDate: string;
  amount: number;
  description: string;
  canBeCanceled: boolean;
  paymentUrl: string;
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
  fullName: string;
  contact: string;
  audienceType: EpayRequestAudienceType;
  audienceTypeDisplay: string;
  userId: string;
  userDisplayName: string;
  userProfileImageLink: string;
  userProfileImageName: string;
  userProfileImageUniqueId: string;
}

export enum EpayRequestAudienceType {
  Default = "Default",
  PhoneNumber = "PhoneNumber",
  Email = "Email",
  CustomerNumber = "CustomerNumber",
}

export interface FileUploadQuery {
  uniqueId: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
}

export interface GroupTransferTargetValidationQuery {
  amount: number;
  name: string;
  identifier: string;
  accountNumber: string;
  userDisplayName: string;
  userPhoneNumber: string;
  status: GroupTransferTargetStatus;
  statusDescription: string;
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
  description: string;
  identifier: string;
}

export interface GroupTransferQuery {
  amount: number;
  description: string;
  userAccountName: string;
  userDisplayName: string;
  voucherId: number;
  createDate: string;
  createDateDisplay: string;
  targets: undefined;
}

export interface GroupTransferTargetQuery {
  accountName: string;
  amount: number;
  description: string;
  userDisplayName: string;
  userPhoneNumber: string;
}

export interface GroupTransferInput {
  userAccountId: number;
  totalAmount: number;
  description: string;
  targets: undefined;
}

export interface GroupTransferTargetInput {
  amount: number;
  description: string;
  identifier: string;
}

export interface ImportantActionApiModel {
  id: number;
  createTime: string;
  createTimeDisplay: string;
  type: NotificationType;
  level: NotificationLevel;
  closeable: boolean;
  dismissible: boolean;
  title: string;
  text: string;
  dataId: string;
  data: string;
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
  name: string;
  amountCalculationExpression: string;
  logoFileName: string;
  logoFileUniqueId: string;
  logoFileUrl: string;
  properties: undefined;
}

export interface PluginPropertyApiModel {
  name: string;
  title: string;
  fieldType: FieldDisplayType;
  isRequired: boolean;
  value: string;
  currencyName: string;
  isFilterable: boolean;
  description: string;
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
  domainEnglishName: string;
  domainPersianName: string;
  domainLogoFileName: string;
  domainLogoFileUniqueId: string;
  domainLogoFileUrl: string;
  accountNumber: string;
  getCommissionFromPayer: boolean;
  userId: string;
  userDisplayName: string;
  userAvatarFileName: string;
  userAvatarFileUniqueId: string;
  userAvatarFileUrl: string;
  subUserId: string;
  subUserDisplayName: string;
  subUserAvatarFileName: string;
  subUserAvatarFileUniqueId: string;
  subUserAvatarFileUrl: string;
}

export interface ReceiptApiModel {
  amount: number;
  callbackUrl: string;
  createdDate: string;
  createDateDisplay: string;
  description: string;
  id: number;
  type: EpayRequestType;
  typeDisplay: string;
  token: string;
  shareUrl: string;
  failed: boolean;
  failureMessage: string;
  payerUserAccountId: number;
  payerUserAccountName: string;
  payerUserAccountNumber: string;
  targetUserDisplayName: string;
  audiences: undefined;
}

export enum EpayRequestType {
  Link = "Link",
  POS = "POS",
  Share = "Share",
  ShareWithBlock = "ShareWithBlock",
  Charge = "Charge",
}

export interface ReceiptAudienceApiModel {
  fullName: string;
  contact: string;
}

export interface PosWalletPayInput {
  userAccountId: number;
  amount: number;
  description: string;
  subUserId: string;
}

export interface PosOnlinePayInput {
  terminalId: string;
  subuserId: string;
  amount: number;
  description: string;
}

export interface ResellerApiModel {
  startDate: string;
  startDateDisplay: string;
  endDate: string;
  endDateDisplay: string;
  isActive: boolean;
  commissionId: number;
  commissionDisplay: string;
  commissionName: string;
  commissionType: ComissionType;
  commissionTypeDisplay: string;
  commissionPercent: number;
  commissionFixedValue: number;
  commissionMaxValue: number;
  introduceLink: string;
  hasSubDomain: boolean;
}

export enum ComissionType {
  Percentage = "Percentage",
  Fixed = "Fixed",
}

export interface ReselledUserFilterData {
  identityStatuses: undefined;
}

export interface DropDownResultOfIdentityStatus {
  items: undefined;
}

export interface DropDownResultItemOfIdentityStatus {
  value: IdentityStatus;
  display: string;
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
  displayName: string;
  phoneNumber: string;
  registerDate: string;
  isPerson: boolean;
  identityStatus: IdentityStatus;
  identityStatusDisplay: string;
  isActive: boolean;
  lastActivityDate: string;
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
  label: string;
  value: number;
  day: number;
  dayName: string;
  month: number;
  monthName: string;
  year: number;
}

export interface AggregationReportQueryOfInteger {
  value: number;
}

export interface DateReportQueryOfInteger {
  key: number;
  label: string;
  value: number;
  day: number;
  dayName: string;
  month: number;
  monthName: string;
  year: number;
}

export interface EpayRequestWcfResult {
  requestToken: string;
  paymentUrl: string;
}

export interface EpayRequestServiceInput {
  userId: string;
  amount: number;
  invoiceNumber: string;
  invoiceDate: string;
  expiresAfterDays: number;
  description: string;
  callbackUrl: string;
  isAutoRedirect: boolean;
  domainId: number;
  terminalId: string;
  userAccountId: number;
  isAutoConfirm: boolean;
  callbackType: CallbackType;
  audiences: undefined;
  getComissionFromPayer: boolean;
}

export interface EpayRequestCheckStatusResult {
  requestStatus: EpayRequestStatus;
  bankReferenceId: string;
  verifyDate: string;
}

export interface DivideEpayRequestServiceInput {
  amount: number;
  divisions: undefined;
  invoiceNumber: string;
  invoiceDate: string;
  expiresAfterDays: number;
  description: string;
  callBackUrl: string;
  isAutoRedirect: boolean;
  isBlocking: boolean;
}

export interface DivideEpayRequestShareModel {
  apiKey: string;
  amount: number;
  dividerAmount: number;
  invoiceNumber: string;
}

export interface DividedEpayRequestUnblockResult {
  unblockedAmount: number;
}

export interface DividedEpayRequestUnblockInput {
  paymentToken: string;
  userApiKey: string;
  invoiceNumber: string;
  dividerAmount: number;
  userAmount: number;
  description: string;
}

export interface DividedEpayRequestCancelResult {
  cancelledAmount: number;
}

export interface DividedEpayRequestCancelInput {
  paymentToken: string;
  userApiKey: string;
  invoiceNumber: string;
  dividerAmount: number;
  userAmount: number;
  shebaNo: string;
  firstName: string;
  lastName: string;
  description: string;
}

export interface SubDomainApiModel {
  domainId: number;
  persianName: string;
  englishName: string;
  subDomainAddress: string;
  resellerUserId: string;
  isActive: boolean;
  logoFileUniqueId: string;
  logoFileName: string;
  logoFileUrl: string;
  domainPersianName: string;
  domainEnglishName: string;
  resellerUserDisplayName: string;
  about: string;
}

export interface SubDomainUpdateApiModel {
  logoFileUniqueId: string;
  about: string;
}

export interface BusinessUserConnectionQuery {
  businessId: string;
  businessAvatarUrl: string;
  businessName: string;
  connectDate: string;
  disconnectDate: string;
  subUserConnectionStatus: SubUserConnectionStatus;
  connectionId: number;
}

export interface SubUserAccountDetailQuery {
  id: number;
  name: string;
  accountNumber: string;
  accountStatus: AccountStatus;
  accountStatusDisplay: string;
  isActive: boolean;
  accountQrCodeUrl: string;
  notificationEnabled: boolean;
  posScanCount: number;
  posPaidCount: number;
  posLinkUrl: string;
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
  accountTitle: string;
  accountNumber: string;
  amount: number;
  createDateTime: string;
  createDate: string;
  description: string;
  remain: number;
  transactionType: TransactionType;
  transactionTypeDisplay: string;
  transactionOperationType: TransactionOperationType;
  transactionOperationTypeDisplay: string;
  targetBusinessCategoryId: number;
  targetBusinessCategoryName: string;
  operationId: number;
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
  bankName: string;
  bankLogo: string;
  accountNumber: string;
  shebaNo: string;
  firstName: string;
  lastName: string;
  status: IdentityStatus;
  statusDescription: string;
  isVisible: boolean;
  name: string;
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

export interface DocumentQuery {
  uniqueId: string;
  fileName: string;
  fileSize: number;
  fileTypes: FileTypes;
  createDate: string;
  documentContentType: DocumentContentType;
  fileUrl: string;
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
  name: string;
  identityType: undefined;
  firstName: string;
  lastName: string;
  nationalCode: string;
  bankId: number;
  accountNumber: string;
  shebaNo: string;
  documents: undefined;
  isVisible: boolean;
}

export interface DocumentInput {
  fileUniqueId: string;
  documentContentType: DocumentContentType;
}

export interface UserBankChangeVisibilityInput {
  isVisible: boolean;
}

export interface UserMeQuery {
  userId: string;
  title: string;
  profileImageLink: string;
  identityStatus: IdentityStatus;
  isBusinessUser: boolean;
  isResellerUser: boolean;
  isSubUser: boolean;
  shareCode: number;
  referredBy: string;
  businessName: string;
  businessUserId: string;
}

export interface UserProfileInput {
  state: string;
  city: string;
  address: string;
}

export interface UserProfileAvatarInput {
  fileUniqueId: string;
}

export interface NewUserIdentityRequestInput {
  firstName: string;
  lastName: string;
  nationalCode: string;
  documents: undefined;
}

export interface UserIdentityRequestQuery {
  firstName: string;
  lastName: string;
  nationalCode: string;
  documents: undefined;
  userIdentityRequestStatus: IdentityStatus;
  userIdentityRequestStatusDescription: string;
}

export interface UserChangePhoneNumberInput {
  phoneNumber: string;
}

export interface UserVerifyChangePhoneNumberInput {
  token: string;
  phoneNumber: string;
}

export interface UserChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpgradeToBusinessUserQuery {
  businessName: string;
  organizationName: string;
  businessLogoImageLink: string;
  businessLogoImageUniqueId: string;
  organizationNationalCode: string;
  businessType: BusinessType;
  userIdentityType: BusinessShareType;
  upgradeToBusinessRequestStatus: IdentityStatus;
  upgradeToBusinessRequestStatusDescription: string;
  managerName: string;
  managerPhoneNumber: string;
  phoneNumber: string;
  faxNumber: string;
  webSiteUrl: string;
  email: string;
  state: string;
  city: string;
  address: string;
  personNationalCode: string;
  documents: undefined;
}

export interface UpgradeToBusinessUserInput {
  logoFileUniqueId: string;
  businessName: string;
  organizationName: string;
  organizationNationalCode: string;
  businessType: undefined;
  userIdentityType: undefined;
  managerName: string;
  managerPhoneNumber: string;
  phoneNumber: string;
  faxNumber: string;
  webSiteUrl: string;
  email: string;
  state: string;
  city: string;
  address: string;
  documents: undefined;
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
  businessUserAvatarUrl: string;
  businessUserTitle: string;
  message: string;
  invitationDate: string;
}

export interface UserWorkspaceQuery {
  businessUserId: string;
  businessAvatarUrl: string;
  businessName: string;
  positionTitle: string;
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
  userDisplayName: string;
  pluginId: number;
  pluginName: string;
  pluginConfig: string;
  pluginAmountCalculationExpression: string;
  pluginLogoFileName: string;
  pluginLogoFileUniqueId: string;
  pluginLogoFileUrl: string;
  properties: undefined;
}

export interface UserPluginApiModel {
  id: number;
  userId: string;
  userDisplayName: string;
  isActive: boolean;
  pluginConfig: string;
  pluginName: string;
}

export interface UserPluginTogggleApiModel {
  isActive: boolean;
}
