import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useMemo } from "react";

// Custom hook for using the selector
const useAppSelector = (selector) => {
  const selectedData = useSelector(selector);
  const memoizedData = useMemo(() => selectedData, [selectedData]);

  return memoizedData;
};

// Custom hook for using the dispatch
const useAppDispatch = () => {
  return useDispatch();
};

export { useAppSelector, useAppDispatch };


