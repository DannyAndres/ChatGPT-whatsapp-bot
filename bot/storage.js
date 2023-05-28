const fs = require('fs');
const path = require('path');
const moment = require('moment');

function Storage() {
  this.getLog = ({ from, memory }) => {
    let history = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'storage/history.json'), 'utf8')
    );

    if (history.data && history.data.length != 0) {
      let historyFromUser = history.data
        .filter((e) => e.from == from)
        .map((e) => {
          e.created_at_moment = moment(e.created_at);
          return e;
        });

      historyFromUser.sort((a, b) => {
        if (a.created_at_moment.isBefore(b.date)) {
          return -1; // a should come before b
        }
        if (b.created_at_moment.isBefore(a.date)) {
          return 1; // b should come before a
        }
        return 0; // a and b are equal in terms of dates
      });

      const past =
        memory != undefined || memory != null ? memory : historyFromUser.length; // this is the amount of context that the model will have
      historyFromUser = historyFromUser.slice(-past);

      let logOutput = [];

      historyFromUser.forEach((e) => {
        logOutput.push({
          role: 'user',
          content: e.message,
        });

        logOutput.push({
          role: 'assistant',
          content: e.response,
        });
      });

      return logOutput;
    }

    return [];
  };

  this.addElement = ({ from, tokens, message, response }) => {
    let history = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'storage/history.json'), 'utf8')
    );

    // HISTORY JSON
    if (!('created_at' in history) || !('created_at_format' in history)) {
      history['created_at'] = moment().format();
      history['created_at_format'] = moment().format('MMMM Do YYYY, h:mm:ss a');
    }

    history['updated_at'] = moment().format();
    history['updated_at_format'] = moment().format('MMMM Do YYYY, h:mm:ss a');

    if (!('data' in history)) {
      history['data'] = [];
    }

    if (!('total' in history)) {
      history['total'] = 0;
    }

    history.data.push({
      created_at: moment().format(),
      created_at_format: moment().format('MMMM Do YYYY, h:mm:ss a'),
      from: from,
      tokens: tokens,
      message: message,
      response: response,
    });

    history.total += 1;

    fs.writeFileSync(
      path.join(__dirname, 'storage/history.json'),
      JSON.stringify(history, null, 2)
    );
  };
}

module.exports = { Storage };
