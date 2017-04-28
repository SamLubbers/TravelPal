

import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import junit.framework.TestCase;

/**
 * @author Robert Cobb <br>
 * Bath University<br>
 * Email: rbc31@bath.ac.uk
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class UserAccountAndFriendTesting extends TestCase {

	private final String SERVER_ADDRESS = "localhost";
	private final int	 SERVER_PORT	= 6969;
	
	/**
	 * 
	 */
	private Client client1;
	private Client client2;
	private Client client3;
	private Client client4;
	private Client client5;
	
	public static void sleep(long time) {
		try {
			Thread.sleep(time);
		} catch (InterruptedException e) {
			fail("Sleep error");
		}
	}
	
	/**
	 * Test1 if server will respond correctly to a made up login
	 */
	@Test 
	public void test00a() {
		String username = "username";
		String password = "password";
		String expected = "LOGIN_FAILED USERNAME_NOT_FOUND" + username;
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);

		client1.login(username,password);
		
		
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :"+ response);
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid email. <br>
	 * 
	 * invalid email (in this test): "InvalidEmail" invalid because no @
	 */
	@Test 
	public void test00b() {
		String username = "username";
		String password = "password";
		String email 	= "InvalidEmail";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED EMAIL_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid email. <br>
	 * 
	 * invalid email (in this test): "Invalid@email@domain.com" invalid because 2 @'s
	 */
	@Test 
	public void test00c() {
		String username = "username";
		String password = "password";
		String email 	= "Invalid@email@domain.com";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED EMAIL_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}

	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid email. <br>
	 * 
	 * invalid email (in this test): "youtube%%@googe.co.uk" invalid chars :%
	 */
	@Test 
	public void test00d() {
		String username = "username";
		String password = "password";
		String email 	= "youtube%%@googe.co.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED EMAIL_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);

		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid email. <br>
	 * 
	 * invalid email (in this test): "thisEmailIsTooLongToBeAcceptedInTheroyThereIsALimtitOf255CharsSoWeShallSeeButThisHasToBeRealllllllllyLong
	 * 								YouReallyDontRealiseHowLong255charsIsUntilYouWriteItDownJeezStillGot75
	 * 								CharsToTypeImagineHavingAnEmailThisLongItBeInsane01234567890123456789012345678990@gmail.com" (too long)
	 */
	@Test 
	public void test00e() {
		String username = "username";
		String password = "password";
		String email 	= "thisEmailIsTooLongToBeAcceptedInTheroyThereIsALimtitOf255"
				 +  "CharsSoWeShallSeeButThisHasToBeRealllllllllyLong"
				 + 	"YouReallyDontRealiseHowLong255charsIsUntilYouWriteItDownJeezStillGot75"
				 + 	"CharsToTypeImagineHavingAnEmailThisLongItBeInsane01234567890123456789012345678990@gmail.com";
		
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED EMAIL_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);

		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals("expected")) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid username. <br>
	 * 
	 * invalid username (in this test): "too" (too short)
	 */
	@Test 
	public void test00f() {
		String username = "too";
		String password = "password";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED USERNAME_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		
		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid username. <br>
	 * 
	 * invalid username (in this test): "ThisisOnly51CharsLongBecauseThatsHowLongnamesCanBea" (too long)
	 */
	@Test 
	public void test00g() {
		String username = "ThisisOnly51CharsLongBecauseThatsHowLongnamesCanBea";
		String password = "password";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED USERNAME_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid username. <br>
	 * 
	 * invalid username (in this test): "testusername!" illegal chars '!'
	 */
	@Test 
	public void test00h() {
		String username = "testusername!";
		String password = "password";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED USERNAME_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid password. <br>
	 * 
	 * invalid password (in this test): "abcdefg" too short min 8 chars
	 */
	@Test 
	public void test00j() {
		String username = "username";
		String password = "abcdefg";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED PASSWORD_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid password. <br>
	 * 
	 * invalid password (in this test): "abcdefg!" illegal chars
	 */
	@Test 
	public void test00k() {
		String username = "username";
		String password = "abcdefg!";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED PASSWORD_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with an invalid password. <br>
	 * 
	 * invalid password (in this test): "thisPasswordIstwoLong0123456789should_be51charslong" too long
	 */
	@Test 
	public void test00l() {
		String username = "username";
		String password = "thisPasswordIstwoLong0123456789should_be51charslong";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED PASSWORD_INVALID " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with valid but boundary data <br>
	 * 
	 * email   : validEmail@bath.ac.uk
	 * username: aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789_ - almost every acceptable char
	 * password: aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789  - almost every acceptable char
	 * 
	 */
	@Test 
	public void test00m() {
		String username = "aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789_";
		String password = "aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789";
		String email 	= "validEmail@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client1.sendMessage(request);
		
		sleep(1000);
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \"ACCOUNT_CREATED aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789_\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test will test if server responds correctly to 
	 * a create account call with valid but boundary data <br>
	 * 
	 * email   : validEmail2@bath.ac.uk
	 * username: char - 3 not acceptable, 4 is 
	 * password: 8charlog  - 8 chars is acceptable, 7 is not just in boundary
	 * 
	 */
	@Test 
	public void test00n() {
		String username = "char";
		String password = "8charlog";
		String email 	= "validEmail2@bath.ac.uk";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client2 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);


		client2.sendMessage(request);
		
		sleep(1000);
		String response = client2.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test to ensure the server responds correctly to an account creation 
	 * request with an email address that already exists in the database.
	 * 
	 * email: validEmail@bath.ac.uk (This email was entered into the database 
	 * in above tests: note that this test depends on previous test working correctly
	 * Specifically {@link #test00m()}
	 */
	@Test
	public void test00o() {
		String email	= "validEmail@bath.ac.uk";
		String username = "aUsername";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED EMAIL_ALREADY_HAS_ACCOUNT " +  username;
		
		client3 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client3.sendMessage(request);
		
		sleep(1000);
		
		String response = client3.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test to ensure the server responds correctly to an account creation 
	 * request with a username already in use.
	 * 
	 * email: char (This user name was entered into the database 
	 * in above tests: note that this test depends on previous test working correctly
	 * Specifically {@link #test00n()}
	 */
	@Test
	public void test00p() {
		String email	= "validEmail3@bath.ac.uk";
		String username = "char";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_NOT_CREATED USERNAME_TAKEN " +  username;
		
		client3 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client3.sendMessage(request);
		
		sleep(1000);
		
		String response = client3.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 */
	@Test
	public void test00q() {
		String email	= "friendTestAccount1@bath.ac.uk";
		String username = "usernameA";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 */
	@Test
	public void test00r() {
		String email	= "friendTestAccount2@bath.ac.uk";
		String username = "usernameB";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 */
	@Test
	public void test00s() {
		String email	= "friendTestAccount3@bath.ac.uk";
		String username = "usernameC";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 */
	@Test
	public void test00t() {
		String email	= "friendTestAccount4@bath.ac.uk";
		String username = "usernameD";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 */
	@Test
	public void test00u() {
		String email	= "friendTestAccount5@bath.ac.uk";
		String username = "usernameE";
		String password = "password";
		String command	= "CREATE_ACCOUNT";
		String request	= command + ' ' + email + ' ' + username + ' ' +password;
		String expected = "ACCOUNT_CREATED " +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 * Tests invalid passowrd
	 */
	@Test
	public void test00v() {
		String username = "usernameA";
		String password = "random_data"; //actual password for this account is password
		String command	= "LOGIN";
		String request	= command + ' ' + username + ' ' +password;
		String expected = "LOGIN_FAILED INCORRECT_PASSWORD" +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Tests acceptable data - test is a set up for friend testing
	 * Tests if password is case sensitive
	 */
	@Test
	public void test00w() {
		String username = "usernameA";
		String password = "PASSWORD"; //actual password for this account is password
		String command	= "LOGIN";
		String request	= command + ' ' + username + ' ' +password;
		String expected = "LOGIN_FAILED INCORRECT_PASSWORD" +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to add a friend without logging in 
	 */
	@Test
	public void test00x() {
		String username = "usernameA";
		String command	= "ADD_FRIEND";
		String request	= command + ' ' + username;
		String expected = "REQUEST_FAILED_TO_SEND NOT_LOGGED_IN" +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to accept a friend request without logging in 
	 */
	@Test
	public void test00y() {
		String username = "usernameA";
		String command	= "ACCEPT_FRIEND";
		String request	= command + ' ' + username;
		String expected = "FAILED_TO_ACCEPT_FRIEND NOT_LOGGED_IN" +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to ignore a friend request without logging in 
	 */
	@Test
	public void test00z() {
		String username = "usernameA";
		String command	= "IGNORE_FRIEND_REQUEST";
		String request	= command + ' ' + username;
		String expected = "FAILED_TO_IGNORE_REQUEST NOT_LOGGED_IN" +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to ignore a friend request without logging in 
	 */
	@Test
	public void test01a() {
		String username = "usernameA";
		String command	= "DELETE_FRIEND";
		String request	= command + ' ' + username;
		String expected = "FRIEND_NOT_DELETED NOT_LOGGED_IN" +  username;
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to view all friend requests without logging in 
	 */
	@Test
	public void test01b() {
		String command	= "SEE_FRIENDS";
		String request	= command;
		String expected = "FAILED_TO_RETRIEVE_FRIENDS NOT_LOGGED_IN";
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to ignore a friend request without logging in 
	 */
	@Test
	public void test01c() {
		String command	= "SEE_SENT_REQUESTS";
		String request	= command;
		String expected = "FAILED_TO_RETRIEVE_REQUESTS NOT_LOGGED_IN";
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Attempts to ignore a friend request without logging in 
	 */
	@Test
	public void test01d() {
		String command	= "SEE_PENDING_REQUESTS";
		String request	= command;
		String expected = "FAILED_TO_RETRIEVE_PEN_REQ NOT_LOGGED_IN";
		
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
}
