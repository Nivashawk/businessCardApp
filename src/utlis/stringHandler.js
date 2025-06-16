export const formatCompanyName = (name) => {
    if (name.length <= 16) return name;
  
    const words = name.split(' ');
    let firstLine = '';
    let secondLine = '';
  
    for (let word of words) {
      if ((firstLine + ' ' + word).trim().length <= 16) {
        firstLine = (firstLine + ' ' + word).trim();
      } else {
        secondLine = (secondLine + ' ' + word).trim();
      }
    }
  
    // Trim second line if needed
    if (secondLine.length > 16) {
      secondLine = secondLine.substring(0, 16).trim() + '...';
    }
  
    return `${firstLine}\n${secondLine}`;
  };
  
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength).trim() + '...' : text;
  };