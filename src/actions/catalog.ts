import axios from "axios";
import { Dispatch } from "redux";
import { createAction, getReturnOfExpression } from "typesafe-actions";
import {
  IServiceBinding,
  IServiceBroker,
  IServiceClass,
  IServiceInstance,
  IServicePlan,
} from "../shared/ServiceCatalog";

export const checkCatalogInstall = createAction("CHECK_INSTALL");
export const installed = createAction("INSTALLED");
export const notInstalled = createAction("_NOT_INSTALLED");
export const requestBrokers = createAction("REQUEST_BROKERS");
export const receiveBrokers = createAction("RECEIVE_BROKERS", (brokers: IServiceBroker[]) => ({
  brokers,
  type: "RECEIVE_BROKERS",
}));
export const requestPlans = createAction("REQUEST_PLANS");
export const receivePlans = createAction("RECEIVE_PLANS", (plans: IServicePlan[]) => ({
  plans,
  type: "RECEIVE_PLANS",
}));
export const requestInstances = createAction("REQUEST_INSTANCES");
export const receiveInstances = createAction(
  "RECEIVE_INSTANCES",
  (instances: IServiceInstance[]) => ({ type: "RECEIVE_INSTANCES", instances }),
);
export const requestBindings = createAction("REQUEST_BINDINGS");
export const receiveBindings = createAction("RECEIVE_BINDINGS", (bindings: IServiceBinding[]) => ({
  bindings,
  type: "RECEIVE_BINDINGS",
}));
export const requestClasses = createAction("REQUEST_PLANS");
export const receiveClasses = createAction("RECEIVE_CLASSES", (classes: IServiceClass[]) => ({
  classes,
  type: "RECEIVE_CLASSES",
}));

const actions = [
  checkCatalogInstall,
  installed,
  notInstalled,
  requestBrokers,
  receiveBrokers,
  requestPlans,
  receivePlans,
  requestInstances,
  receiveInstances,
  requestBindings,
  receiveBindings,
  requestClasses,
  receiveClasses,
].map(getReturnOfExpression);

export type ServiceCatalogAction = typeof actions[number];
