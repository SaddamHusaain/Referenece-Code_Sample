import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./services/api";
import { confirmModalSlice } from "../features/delete-confirm-slice";
import { documentReducer } from "../features/match-supplier-document/add-document-slice";
import { documentQueryReducer } from "../features/match-supplier-document/add-query-slice";
import { globalDraftModeReducer } from "../features/match-supplier-document/global-draft-mode";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    confirmModal: confirmModalSlice.reducer,
    documents: documentReducer,
    documentQuery: documentQueryReducer,
    globalDraftMode: globalDraftModeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

setupListeners(store.dispatch);
export default store;
