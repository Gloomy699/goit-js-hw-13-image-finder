export default async (name, page) => {
    try {
        const picturesList = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${name}&page=${page}&per_page=12&key=19032904-74cd0d38bd211043e9b213612`);
        return picturesList.json();
    } catch (error) {
        return error;
    }
}
  
