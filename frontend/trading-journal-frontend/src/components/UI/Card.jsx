import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: 'card-default',
    primary: 'card-primary',
    secondary: 'card-secondary',
    success: 'card-success',
    warning: 'card-warning',
    danger: 'card-danger'
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
