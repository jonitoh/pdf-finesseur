import { GetState, StoreApi, SetState } from 'zustand';

// cf. https://2ality.com/2020/04/typing-functions-typescript.html#checking-function-declarations-(extravagant)
export type StoreFromSlice<IStore extends object, Slice, MinimalStore = {}> = (
  set: SetState<IStore & MinimalStore>, // NamedSet<IStore>,
  get: GetState<IStore & MinimalStore>,
  api: StoreApi<IStore & MinimalStore>
) => Slice;

export type OptionForSelector = {
  value: string;
  label?: string;
};
