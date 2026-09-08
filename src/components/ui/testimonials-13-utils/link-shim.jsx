import React from 'react';

const Link = React.forwardRef(function Link({ href = '#', children, ...props }, ref) {
  return (
    <a ref={ref} href={href} {...props}>
      {children}
    </a>
  );
});

export default Link;
