var $board = $('main'),
    $card = $('.card'),
    $itemCount = $('.score span'),
    $wins = $('.wins span'),
    $turns = $('.turns span'),
    $attempts = $('.attempts span'),
    $attemptsOverall = $('.attempts-overall span'),
    $success = $('.success'),
    $successMsg = $('.success-message'),
    $successIcon = $('.success-icon'),
    $btnContinue = $('.btn-continue'),
    $btnSound = $('.btn-sound'),
    selectedClass = 'is-selected',
    visibleClass = 'is-visible',
    playSoundClass = 'is-playing',
    scoreUpdateClass = 'is-updating',
    lastTurnClass = 'last-turn',
    dataMatch = 'data-matched',
    dataType = 'data-type',
    turnsCount = 2,
    winsCount = 0,
    attemptsCount = 0,
    attemptsOverallCount = 0,
    tooManyAttempts = 8,
    timeoutLength = 600,
    card1, card2, msg;

// Embaralha as cartas
shuffleCards();

$card.on('click', function() {
  // Adiciona classe para as cartas que ainda não deram match
  if ($(this).attr(dataMatch) == 'false') {
    $(this).addClass(selectedClass);
  }

  var selectedCards = $('.' + selectedClass);

  // Verifica se as cartas deram match
  if (selectedCards.length == 2) {
    card1 = selectedCards.eq(0).attr(dataType);
    card2 = selectedCards.eq(1).attr(dataType);

    if (card1 == card2) {
      if ($btnSound.hasClass(playSoundClass)) {
        soundMatch.play(); 
      }
      selectedCards
        .attr(dataMatch, true)
        .removeClass(selectedClass)

    } else {
      if ($btnSound.hasClass(playSoundClass)) {
        soundNoMatch.play(); 
      }
      setTimeout(function() {
        turnsCount--;
        $turns
          .addClass(scoreUpdateClass)
          .html(turnsCount);
        selectedCards.removeClass(selectedClass);
      }, timeoutLength);

      if(turnsCount === 1) {
        setTimeout(function() {
          $turns.addClass(lastTurnClass);
        }, timeoutLength);
      }

      if(turnsCount <= 0) {
        setTimeout(function() {
          turnsCount = 2;
          $turns
            .removeClass(lastTurnClass)
            .html(turnsCount);
          $card.attr(dataMatch, false);
          attemptsCount += 1;
          $attempts
            .addClass(scoreUpdateClass)
            .html(attemptsCount);
        }, timeoutLength);
      }

    }
  }

  // Vencedor!
  if ($('[' + dataMatch + '="true"]').length == $card.length) {
    // Mostra tela de vitória
    $success.addClass(visibleClass);
    if (attemptsCount <= tooManyAttempts) {
      setTimeout(function() {
        if ($btnSound.hasClass(playSoundClass)) {
          soundSuccess.play(); 
        }
      }, 600);
    }
    // Atualiza mensagem de vitória de acordo com número de tentativas
    switch(true) {
      case (attemptsCount <= 2):
        msg = "SUPER!!!";
        $successIcon.attr(dataType, "star");
        break;
      case (attemptsCount > 2 && attemptsCount <= 5):
        msg = "Bom Trabalho!";
        $successIcon.attr(dataType, "mushroom");
        break;
      case (attemptsCount > 5 && attemptsCount <= 8):
        msg = "Você pode fazer melhor!";
        $successIcon.attr(dataType, "flower");
        break;
      case (attemptsCount > tooManyAttempts):
        msg = "Demorou um tempo...";
        $successIcon.attr(dataType, "chest");
        break;
    }
    $successMsg.text(msg);

    setTimeout(function() {
      attemptsOverallCount += attemptsCount;
      $attemptsOverall
        .addClass(scoreUpdateClass)
        .html(attemptsOverallCount);
      winsCount += 1;
      $wins
        .addClass(scoreUpdateClass)
        .html(winsCount);
      $card.attr(dataMatch, false);
    }, 1200);
  }

});

// Remove a pontuação e atualiza a classe depois da animação
$itemCount.on(
  "webkitAnimationEnd oanimationend msAnimationEnd animationend",
  function() {
    $itemCount.removeClass(scoreUpdateClass);
  }
);

// No próximo turno...
$btnContinue.on('click', function() {
  $success.removeClass(visibleClass);
  shuffleCards();
  setTimeout(function() {
    turnsCount = 2;
    $turns
      .removeClass(lastTurnClass)
      .html(turnsCount);
    attemptsCount = 0;
    $attempts.html(attemptsCount);
  }, 300);
});

// Função embaralhar as cartas
function shuffleCards() {
  var cards = $board.children();
  while (cards.length) {
    $board.append(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
  }
}