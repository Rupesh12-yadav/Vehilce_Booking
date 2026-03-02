const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-soft border border-gray-100 ${
        hover ? 'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
