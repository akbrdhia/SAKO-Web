import { getPasswordStrength } from '../utils/validation';

function PasswordStrengthIndicator({ password }) {
  const strength = getPasswordStrength(password);
  
  if (!password) {
    return null;
  }
  
  const getColorClass = () => {
    switch (strength.color) {
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  const getTextColorClass = () => {
    switch (strength.color) {
      case 'red':
        return 'text-red-700';
      case 'orange':
        return 'text-orange-700';
      case 'yellow':
        return 'text-yellow-700';
      case 'green':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };
  
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index <= strength.score ? getColorClass() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${getTextColorClass()} font-medium`}>
        Kekuatan Password: {strength.label}
      </p>
    </div>
  );
}

export default PasswordStrengthIndicator;
