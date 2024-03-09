import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'

type State = {
  level: number
}

export const app = new Frog<{ State: State }>({
  initialState: {
    level: 1
  }
})

const gen_intents = (lvl: string, correct: boolean, text: string) => {
  let level = parseInt(lvl) < 4 ? "/lvl" + lvl : "gameover"
  return ([
    !correct && <TextInput placeholder={text} />,
    !correct && < Button >Solve</Button >,
    !correct && <Button action="/gameover">Give up</Button>,
    correct && <Button action={level}>Go to {"level " + lvl}</Button>
  ])
}

app.use('/*', serveStatic({ root: './public' }))

app.frame('/', (c) => {
  return c.res({
    image: (<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
      <img src="http://upload.wikimedia.org/wikipedia/en/9/9f/Over_9000!.png" alt="" />
    </div>),
    intents: [
      <Button
        action="/lvl1"
        value="1"
      >Find out my meme level
      </Button>,
    ]
  })
})

app.frame('/lvl1', (c) => {
  const { inputText, status, deriveState } = c
  let userAnswer = inputText;
  let correct = userAnswer && parseInt(userAnswer) > 9000;
  const state = deriveState(previousState => {
    if (correct) previousState.level = 2
  })
  console.log(state.level);
  console.log(correct);

  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        <img src="http://upload.wikimedia.org/wikipedia/en/9/9f/Over_9000!.png" alt="" height="50%" />
      </div>),
    intents: gen_intents((state.level).toString(), !!correct, "How much is it?")
  })
})



app.frame('/lvl2', (c) => {
  const { inputText, status, deriveState } = c
  const correct = inputText && inputText == "21"
  const state = deriveState(previousState => {
    if (correct) previousState.level = 3
  })
  console.log(correct);
  console.log(inputText);
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        <img src="https://i.kym-cdn.com/entries/icons/mobile/000/016/998/You_stupid_vine_(what's_9_10)_0-2_screenshot.jpg" alt="" />
      </div>),
    intents: gen_intents((state.level).toString(), !!correct, 'What\'s 9 + 10')
  })
})


app.frame('/lvl3', (c) => {
  const { inputText, deriveState } = c
  const correct = inputText && inputText == "cheezburger"
  const state = deriveState(previousState => {
    if (correct) previousState.level = 4
  })
  console.log(correct);
  console.log(inputText);
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        <img src="https://i.imgur.com/lSTVQgU.png" alt="" />
      </div>),
    intents: gen_intents((state.level).toString(), !!correct, "Can I Haz _________")
  })
})



app.frame('/gameover', (c) => {
  const { deriveState } = c
  const state = deriveState(previousState => {
    previousState.level
  })
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        <h1> Congrats meemer </h1>
        Your level is over {state.level}
      </div>),
    intents: [
      <Button.Reset>Restart</Button.Reset>
    ]
  })
})