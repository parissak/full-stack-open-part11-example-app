describe('Phonebook', function() {
	it('front page can be opened', function() {
		cy.visit('http://localhost:5000')
		cy.contains('Phonebook')
		cy.contains('add a new')
		cy.contains('Numbers')
	})
})