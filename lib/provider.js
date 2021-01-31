import { createContext, Dispatch, useContext, useReducer } from 'react';

const store={
    total:0,
    notification:0,
    message:0,
}


export function messageReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type] + action.payload.count,
        total: state.total + action.payload.count,
      };
    case 'decrement':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type] - action.payload.count,
        total: state.total - action.payload.count,
      };
    case 'reset':
      return { ...store };
    default:
      return { ...state };
  }
}

export const MessageStatisticsContext =createContext(null);

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, store);
  return (
    <MessageStatisticsContext.Provider value={{ msgStore: state, dispatch }}>
      {children}
    </MessageStatisticsContext.Provider>
  );
};

export const useMsgStatistic = () =>
  useContext(MessageStatisticsContext);
