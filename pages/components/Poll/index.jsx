import React, { Component, useEffect, useState } from 'react'
import animate from './animate.module.css'
import styles from './styles.module.css'

const themes = {
  purple: ['#6D4B94', '#7C6497', '#6D4B943B'],
  red: ['#E23D3D', '#EF4545', '#FF28283B'],
  blue: ['#5674E0', '#5674E0', '#5674E03B'],
  black: ['#303030', '#303030', '#3030303B'],
  white: ['#ffffff', '#ffffff', '#ffffff3B'],
  cyan: ['#00BCDD', '#00BCDD', '#00BCDD3B']
}

export default function Poll(props) {
  // Answers prop format: [ { option: string, votes: number } ]

  const defaultProps = {
    customStyles: {
      questionSeparator: false,
      questionSeparatorWidth: 'question',
      questionBold: true,
      questionColor: '#303030',
      align: 'center',
      theme: 'black'
    },
    noStorage: true
  }

  const theProps = Object.assign({}, defaultProps, props);

  const [poll, setPoll] = useState({
    voted: false,
    option: ''
  })
  const [totalVotes, setTotalVotes] = useState(0);
  
  useEffect(() => {
    const { noStorage } = theProps
    if (!noStorage) checkVote()
    loadVotes()

  }, [poll, totalVotes]) 

  function checkVote() {
    const { question } = theProps
    const storage = getStoragePolls()
    const answer = storage.filter(answer => answer.question === question && answer.url === location.href)

    if (answer.length) {
      setPollVote(answer[0].option)
    }
  }

  function loadVotes() {
    const { answers, vote } = theProps
    const totalVotes = answers.reduce((total, answer) => total + answer.votes, 0)
      setTotalVotes(answers.reduce((total, answer) => total + answer.votes, 0))
    if (vote) setPollVote(vote)
  }

  function setPollVote(answer) {
    const { answers, vote } = theProps
    const optionsOnly = (answers || []).map(item => item.option)

    if (optionsOnly.includes(answer)) {
      const newPoll = { ...poll }
      newPoll.voted = true
      newPoll.option = answer

      if (!vote) {
        setPoll(newPoll);
        setTotalVotes(totalVotes + 1);

      } else {
        setPoll(newPoll);
      }
    }
  }

  // Storage format: [ { url: string, question: string, option: string } ]
  function getStoragePolls() { return JSON.parse(localStorage.getItem('react-polls')) || []}

  function vote(answer) {
    const { question, onVote, noStorage } = theProps
    if (!noStorage) {
      const storage = getStoragePolls()
      storage.push({
        url: location.href,
        question: question,
        option: answer
      })
      localStorage.setItem('react-polls', JSON.stringify(storage))
    }

    setPollVote(answer)
    onVote(answer)
  }

  function calculatePercent(votes, total) {
    if (votes === 0 && total === 0) {
      return '0%'
    }
    return `${parseInt((votes / total) * 100)}%`
  }

  function alignPoll(customAlign) {
    if (customAlign === 'left') {
      return 'flex-start'
    } else if (customAlign === 'right') {
      return 'flex-end'
    } else {
      return 'center'
    }
  }

  function obtainColors(customTheme) {
    const colors = themes[customTheme]
    if (!colors) {
      return themes['black']
    }
    return colors
  }

  const { question, answers, customStyles } = theProps
  const colors = obtainColors(customStyles.theme)

  return (
    <article className={`${animate.animated} ${animate.fadeIn} ${animate.faster} ${styles.poll}`} style={{ textAlign: customStyles.align, alignItems: alignPoll(customStyles.align), width: 400 }}>
      <h3 className={styles.question} style={{ borderWidth: customStyles.questionSeparator ? '1px' : '0', alignSelf: customStyles.questionSeparatorWidth === 'question' ? 'center' : 'stretch', fontWeight: customStyles.questionBold ? 'bold' : 'normal', color: customStyles.questionColor }}>{question}</h3>
      <ul className={styles.answers}>
        {(answers || []).map(answer => (
          <li key={answer.option}>
            {!poll.voted ? (
              <button className={`${animate.animated} ${animate.fadeIn} ${animate.faster} ${styles.option} ${styles[customStyles.theme]}`} style={{ color: colors[0], borderColor: colors[1] }} type='button' onClick={() => vote(answer.option)}>
                {answer.option}
              </button>
            ) : (
              <div className={`${animate.animated} ${animate.fadeIn} ${animate.faster} ${styles.result}`} style={{ color: colors[0], borderColor: colors[1] }}>
                <div className={styles.fill} style={{ width: calculatePercent(answer.votes, totalVotes), backgroundColor: colors[2] }} />
                <div className={styles.labels}>
                  <span className={styles.percent} style={{ color: colors[0] }}>{calculatePercent(answer.votes, totalVotes)}</span>
                  <span className={`${styles.answer} ${answer.option === poll.option ? styles.vote : ''}`} style={{ color: colors[0] }}>{answer.option}</span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className={styles.votes}>{`${totalVotes} vote${totalVotes !== 1 ? 's' : ''}`}</p>
    </article>
  )
}
