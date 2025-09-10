import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Interface para definir a estrutura de cada carta
interface Card {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  // Emojis para o jogo. 12 emojis para formar 12 pares.
  private emojis = ['😀', '🐶', '🍎', '⚽️', '🚗', '⏰', '🎉', '💡', '📚', '💻', '🌍', '❤️'];
  
  // Array que vai conter as 25 cartas do tabuleiro
  public cards: Card[] = [];
  
  // Variáveis para controlar o estado do jogo
  private flippedCards: Card[] = [];
  private lockBoard = false;
  public matchesFound = 0;
  public totalMatches = 12; // Total de pares a serem encontrados
  public attempts = 0; // Contador de tentativas

  constructor() {}

  ngOnInit() {
    this.setupGame();
  }

  // Prepara e inicia o jogo
  setupGame() {
    this.matchesFound = 0;
    this.attempts = 0; // Reseta as tentativas
    this.flippedCards = [];
    this.lockBoard = false;

    // Duplica os emojis para criar os pares
    const pairedEmojis = [...this.emojis, ...this.emojis];
    
    // Adiciona um emoji único para completar o grid 5x5 (25 cartas)
    const singleEmoji = '⭐';
    
    const gameEmojis = [...pairedEmojis, singleEmoji];

    // Mapeia os emojis para o array de cartas
    this.cards = this.shuffleArray(gameEmojis).map(emoji => ({
      emoji: emoji,
      isFlipped: false,
      isMatched: false,
    }));
  }

  // Lógica para virar uma carta
  flipCard(card: Card) {
    // Não faz nada se o tabuleiro estiver bloqueado, a carta já estiver virada ou já tiver par
    if (this.lockBoard || card.isFlipped || card.isMatched) {
      return;
    }

    card.isFlipped = true;
    this.flippedCards.push(card);

    // Se duas cartas foram viradas, verifica se são um par
    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  private checkForMatch() {
    this.lockBoard = true; 
    this.attempts++; // Incrementa o contador de tentativas
    
    const [card1, card2] = this.flippedCards;

    if (card1.emoji === card2.emoji) {
      // É um par!
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchesFound++;
      this.flippedCards = [];
      this.lockBoard = false;
      this.checkGameWin();
    } else {
      // Não é um par, vira de volta após um tempo
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.lockBoard = false;
      }, 1000);
    }
  }
  
  private checkGameWin() {
      if (this.matchesFound === this.totalMatches) {
          // Atraso para o jogador ver o último par antes do alerta
          setTimeout(() => {
              alert('Parabéns, você venceu!');
              this.setupGame(); // Reinicia o jogo
          }, 500);
      }
  }

  // Função para embaralhar o array de cartas
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Função para o botão de reiniciar
  resetGame() {
      this.setupGame();
  }
}

