import { createStore, applyMiddleware } from 'redux';

export default function configureStore(initialState) {
	return createStore(
		() => {{}},
		initialState,
		// applyMiddleware(...middleware)
	);
}