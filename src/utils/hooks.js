import * as React from 'react';

export function state(initialValue) {
  const [state, useState] = React.useState(initialValue);

  return [state, useState];
}
