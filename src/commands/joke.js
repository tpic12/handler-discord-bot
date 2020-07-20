module.exports = {
  name: "joke",
  async execute(message, axios, args) {
    let getJoke = async () => {
      let response = await axios.get(
        "https://official-joke-api.appspot.com/random_joke"
      );
      let joke = response.data;
      return joke;
    };
    let jokeValue = await getJoke();
    message.reply(
      `Here's your joke \n ${jokeValue.setup} \n\n ${jokeValue.punchline}`
    );
  },
};
