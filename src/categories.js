// TODO: Capitalize all words on allCategories array. Note: 'sci-fi' should be 'Sci-Fi'.
const capitalizeWords = word => word;

const categories = options => {
  return (files, metalsmith, done) => {
    const allCategories = {};

    Object.values(files)
      .filter(file => file.categories && file.categories.length > 0)
      .forEach(file => {
        file.categories.forEach(categoryName => {
          const category = categoryName.toLowerCase();

          if (!allCategories[category]) {
            allCategories[category] = [];
          }

          allCategories[category] = [
            ...allCategories[category],
            file,
          ];
        })
      });
    
    Object.keys(allCategories)
      .forEach(categoryName => {
        const category = capitalizeWords(categoryName);

        // TODO: This should not be like this. We need another plugin to handle category layout.
        const contents = '<ul>' + allCategories[categoryName]
          .map(movie => `${movie.name} (${movie.year})`)
          .map(movieString => `<li>${movieString}</li>`)
          .join('') + '</ul>';

        files[`categories/${categoryName}/index.html`] = {
          contents,
          layout: 'category',
          movies: allCategories[categoryName],
        };
      })

    done();
  };
};

export default categories;
