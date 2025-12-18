describe('Star Wars Films Catalog E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Application Load', () => {
    it('should load the application successfully', () => {
      cy.contains('Star Wars Films Catalog').should('be.visible');
    });

    it('should display the search input', () => {
      cy.get('input[type="text"]').should('be.visible');
      cy.get('input[type="text"]').should('have.attr', 'placeholder').and('include', 'A New Hope');
    });
  });

  describe('Films Grid', () => {
    it('should load and display films', () => {
      cy.get('app-film-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('should display film titles', () => {
      cy.get('mat-card-title', { timeout: 10000 }).should('contain', 'A New Hope');
    });

    it('should display film details', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Release Date:').should('be.visible');
        cy.contains('Director:').should('be.visible');
        cy.contains('Producer:').should('be.visible');
        cy.contains('Opening Crawl').should('be.visible');
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter films by search term', () => {
      cy.get('app-film-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
      
      cy.get('input[type="text"]').type('Empire');
      
      cy.wait(500);
      
      cy.get('app-film-card').should('have.length', 1);
      cy.get('mat-card-title').should('contain', 'The Empire Strikes Back');
    });

    it('should show "no results" when search has no matches', () => {
      cy.get('app-film-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
      
      cy.get('input[type="text"]').type('NonExistentFilm123');
      
      cy.wait(500);
      
      cy.contains('No films found matching your search criteria').should('be.visible');
    });

    it('should be case-insensitive', () => {
      cy.get('app-film-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
      
      cy.get('input[type="text"]').type('HOPE');
      
      cy.wait(500);
      
      cy.get('mat-card-title').should('contain', 'A New Hope');
    });

    it('should reset results when search is cleared', () => {
      cy.get('app-film-card', { timeout: 10000 }).then(($cards) => {
        const initialCount = $cards.length;
        
        cy.get('input[type="text"]').type('Jedi');
        cy.wait(500);
        cy.get('app-film-card').should('have.length.lessThan', initialCount);
        
        cy.get('input[type="text"]').clear();
        cy.wait(500);
        cy.get('app-film-card').should('have.length', initialCount);
      });
    });
  });

  describe('Film Card Expansion', () => {
    it('should expand and collapse opening crawl', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Show More').should('be.visible').click();
        cy.contains('Show Less').should('be.visible');
        
        cy.contains('Show Less').click();
        cy.contains('Show More').should('be.visible');
      });
    });
  });

  describe('Characters Drill-down', () => {
    it('should have characters section collapsed by default', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Characters').should('be.visible');
        cy.get('mat-expansion-panel').first().should('not.have.class', 'mat-expanded');
      });
    });

    it('should load characters when panel is expanded', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Characters').click();
        cy.get('app-characters-list', { timeout: 15000 }).within(() => {
          cy.get('.character-name', { timeout: 10000 }).should('have.length.greaterThan', 0);
        });
      });
    });

    it('should display character details', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Characters').click();
        cy.get('app-characters-list', { timeout: 15000 }).within(() => {
          cy.get('.character-item', { timeout: 10000 }).first().within(() => {
            cy.contains('Height:').should('be.visible');
            cy.contains('Mass:').should('be.visible');
            cy.contains('Hair Color:').should('be.visible');
            cy.contains('Eye Color:').should('be.visible');
            cy.contains('Birth Year:').should('be.visible');
          });
        });
      });
    });
  });

  describe('Starships Drill-down', () => {
    it('should load starships when panel is expanded', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Starships').click();
        
        cy.get('app-starships-list', { timeout: 15000 }).within(() => {
          cy.get('.starship-name, .no-data', { timeout: 10000 }).should('exist');
        });
      });
    });
  });

  describe('Vehicles Drill-down', () => {
    it('should load vehicles when panel is expanded', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Vehicles').click();
        
        cy.get('app-vehicles-list', { timeout: 15000 }).within(() => {
          cy.get('.vehicle-name, .no-data', { timeout: 10000 }).should('exist');
        });
      });
    });
  });

  describe('Species Drill-down', () => {
    it('should load species when panel is expanded', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Species').click();
        
        cy.get('app-species-list', { timeout: 15000 }).within(() => {
          cy.get('.species-name, .no-data', { timeout: 10000 }).should('exist');
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API failure gracefully', () => {
      cy.intercept('GET', 'https://swapi.info/api/films', {
        statusCode: 500,
        body: 'Internal Server Error'
      }).as('getFilmsError');

      cy.visit('/');
      cy.wait('@getFilmsError');

      cy.get('app-error-message', { timeout: 5000 }).should('be.visible');
      cy.get('app-error-message').should('contain.text', 'Error');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.get('app-film-card', { timeout: 10000 }).should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.get('app-film-card', { timeout: 10000 }).should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.get('app-film-card', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner while fetching films', () => {
      cy.intercept('GET', 'https://swapi.info/api/films', (req) => {
        req.reply((res) => {
          res.delay = 2000;
        });
      }).as('getFilms');

      cy.visit('/');
      cy.get('app-loading-spinner').should('be.visible');
      cy.wait('@getFilms');
    });

    it('should show loading spinner while fetching characters', () => {
      cy.get('app-film-card', { timeout: 10000 }).first().within(() => {
        cy.contains('Characters').click();
        cy.get('app-characters-list').within(() => {
          cy.get('mat-spinner, .character-name', { timeout: 10000 }).should('exist');
        });
      });
    });
  });
});
