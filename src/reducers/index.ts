import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { IStoreState } from "../shared/types";
import { catalogReducer } from "./catalog";
import chartsReducer from "./charts";
import { reposReducer } from "./repos";

const rootReducer = combineReducers<IStoreState>({
  catalog: catalogReducer,
  charts: chartsReducer,
  repos: reposReducer,
  router: routerReducer,
});

export default rootReducer;
