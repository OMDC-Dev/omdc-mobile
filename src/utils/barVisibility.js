export const getIsTabBarVisible = route => {
  const routeName = route.state
    ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'Home';

  switch (routeName) {
    case 'Home':
      return true;
    case 'Transaction':
      return true;
    default:
      return false;
  }
};

export const getIsHeaderVisible = route => {
  const routeName = route.state
    ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'WithdrawInit';

  switch (routeName) {
    case 'WithdrawInit':
      return true;
    default:
      return false;
  }
};
