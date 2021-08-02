import * as ActionTypes from "./ActionTypes";

export const comments = (state = { errMess: null, comments: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return { ...state, errMess: null, comments: action.payload };

    case ActionTypes.COMMENTS_FAILED:
      return { ...state, errMess: action.payload };

    // wk2 task3
    case ActionTypes.ADD_COMMENT:
      const comment = action.payload;
      comment.id = comments.length;

      return { ...state, comments: state.comments.concat(comment) };

    default:
      return state;
  }
};
