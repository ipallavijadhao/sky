Feature: This feature will make sure that the shop page is navigable and usable.
    Scenario: User navigates to shop page
        Given I am on the home page
        When I navigate to 'Deals'
        Then the user should be on the 'https://www.sky.com/deals' page

    Scenario: User sees tiles on the shop page
        Given I am on the home page
        When I try to sign in with invalid credentials
        Then I should see a box with the text 'Create your My Sky password'

    Scenario: User sees a list of deals on the deals page
        Given I am on the 'https://www.sky.com/deals' page
        Then I see a list of deals with a price to it
            | 26 |
            | 41 |
            | 37 |