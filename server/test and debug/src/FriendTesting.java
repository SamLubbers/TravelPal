import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class FriendTesting {

	private final String SERVER_ADDRESS = "localhost";
	private final int	 SERVER_PORT	= 6969;
	
	Client client1;
	Client client2;
	Client client3;
	Client client4;
	Client client5;
	
	
	public static void sleep(long time) {
		try {
			Thread.sleep(time);
		} catch (InterruptedException e) {
			fail("Sleep error");
		}
	}
	
	
	/**
	 * Logins all 5 clients into the 5 accounts for 
	 */
	@Before
	public void test02a() {
		//set up queries for 5 clients
		String username1 = "usernameA";
		String username2 = "usernameB";
		String username3 = "usernameC";
		String username4 = "usernameD";
		String username5 = "usernameE";
		
		//all use the same password
		String password = "password"; 
		String command	= "LOGIN";
		
		String request1	= command + ' ' + username1 + ' ' +password;
		String request2	= command + ' ' + username2 + ' ' +password;
		String request3	= command + ' ' + username3 + ' ' +password;
		String request4	= command + ' ' + username4 + ' ' +password;
		String request5	= command + ' ' + username5 + ' ' +password;
		
		String expected1 = "LOGIN_SUCCESSFUL " +  username1;
		String expected2 = "LOGIN_SUCCESSFUL " +  username2;
		String expected3 = "LOGIN_SUCCESSFUL " +  username3;
		String expected4 = "LOGIN_SUCCESSFUL " +  username4;
		String expected5 = "LOGIN_SUCCESSFUL " +  username5;
		
		//connect to server
		client1 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client2 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client3 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client4 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		client5 = Client.getNewClientAndConnect(SERVER_ADDRESS,SERVER_PORT);
		
		//login to accounts
		client1.sendMessage(request1);
		client2.sendMessage(request2);
		client3.sendMessage(request3);
		client4.sendMessage(request4);
		client5.sendMessage(request5);
		
		sleep(1000);//wait for response
		
		//get responses
		String response1 = client1.getMessage();
		String response2 = client2.getMessage();
		String response3 = client3.getMessage();
		String response4 = client4.getMessage();
		String response5 = client5.getMessage();
		
		//check responses against expected
		if (!response1.equals(expected1)) {
			fail("expected response: \""+expected1+"\" got :\""+ response1+"\"");
		}
		if (!response2.equals(expected2)) {
			fail("expected response: \""+expected2+"\" got :\""+ response2+"\"");
		}
		if (!response3.equals(expected3)) {
			fail("expected response: \""+expected3+"\" got :\""+ response3+"\"");
		}
		if (!response4.equals(expected4)) {
			fail("expected response: \""+expected4+"\" got :\""+ response4+"\"");
		}
		if (!response5.equals(expected5)) {
			fail("expected response: \""+expected5+"\" got :\""+ response5+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to made up username
	 */
	@Test
	public void test02b() {
		String command	= "ADD_FRIEND";
		String username = "made_up_username";
		String request	= command + ' ' + username;
		String expected = "REQUEST_FAILED_TO_SEND USERNAME_NOT_FOUND " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to all caps version of a valid username
	 */
	@Test
	public void test02c() {
		String command	= "ADD_FRIEND";
		String username = "USERNAMEB";
		String request	= command + ' ' + username;
		String expected = "REQUEST_FAILED_TO_SEND USERNAME_NOT_FOUND " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to attempting to add self as a friend
	 */
	@Test
	public void test02d() {
		String command	= "ADD_FRIEND";
		String username = "usernameA"; //thats the username of client 1
		String request	= command + ' ' + username;
		String expected = "REQUEST_FAILED_TO_SEND CANNOT_FRIEND_SELF " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to attempting accept a non
	 * existing friend request
	 */
	@Test
	public void test02e() {
		String command	= "ACCEPT_FRIEND";
		String username = "usernameB"; //thats the username of client 2
		String request	= command + ' ' + username;
		String expected = "FAILED_TO_ACCEPT_FRIEND NO_REQUEST_FOUND " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to attempting ignore a non
	 * existing friend request
	 */
	@Test
	public void test02f() {
		String command	= "IGNORE_FRIEND_REQUEST";
		String username = "usernameB"; //thats the username of client 2
		String request	= command + ' ' + username;
		String expected = "FAILED_TO_IGNORE_REQUEST NO_REQUEST_FOUND " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to attempting ignore a non
	 * existing friend request
	 */
	@Test
	public void test02g() {
		String command	= "DELETE_FRIEND";
		String username = "usernameB"; //thats the username of client 2
		String request	= command + ' ' + username;
		String expected = "FRIEND_NOT_DELETED NO_FRIEND_FOUND " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to a see friends list request
	 * 
	 * In this test no friends have been added so the list returned should be empty
	 */
	@Test
	public void test02h() {
		String command	= "SEE_FRIENDS";
		String request	= command;
		String expected = "FRIENDS";//no friends at this point
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to a see requests sent
	 * 
	 * In this test no friends have been added so the list returned should be empty
	 */
	@Test
	public void test02i() {
		String command	= "SEE_SENT_REQUESTS";
		String request	= command;
		String expected = "REQUESTS";//no friends at this point
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to a see requests sent
	 * 
	 * In this test no friends have been added so the list returned should be empty
	 */
	@Test
	public void test02j() {
		String command	= "SEE_PENDING_REQUESTS";
		String request	= command;
		String expected = "PENDING_REQUESTS";//no friends at this point
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test to see if server allows for adding friends correctly
	 */
	@Test
	public void test02k() {
		String command	= "ADD_FRIEND";
		String username = "usernameB";
		String request	= command + ' ' + username;
		String expected = "FRIEND_REQUEST_SENT " + username;//no friends at this point
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test to see if server allows for adding friends correctly
	 */
	@Test
	public void test02l() {
		String command	= "ADD_FRIEND";
		String username = "usernameB";
		String request	= command + ' ' + username;
		String expected = "FRIEND_REQUEST_SENT " + username;//no friends at this point
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * User A has added User B - User B has not accepted.
	 * Test to see if userA can accept User B as a friend
	 */
	@Test
	public void test02m() {
		String command	= "ACCEPT_FRIEND";
		String username = "usernameB"; //thats the username of client 2
		String request	= command + ' ' + username;
		String expected = "FAILED_TO_ACCEPT_FRIEND NO_REQUEST_FOUND " + username;
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * User A has added User B - User B has not accepted.
	 * Test to see if user b can see the request
	 */
	@Test
	public void test02n() {
		String command	= "SEE_PENDING_REQUESTS";
		String request	= command;
		String expected = "PENDING_REQUESTS usernameA";//request from A
		
		client2.sendMessage(request);
		
		sleep(1000);
		
		String response = client2.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * User A has added User B - User B has not accepted.
	 * Test to see if user A can see the request
	 */
	@Test
	public void test02o() {
		String command	= "SEE_SENT_REQUESTS";
		String request	= command;
		String expected = "SENT_REQUESTS usernamB";//has added B
		
		client1.sendMessage(request);
		
		sleep(1000);
		
		String response = client1.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	
	/**
	 * User A has added User B - User B has not accepted.
	 * Test to see if userB can ignore UserA's request
	 */
	@Test
	public void test02p() {
		String command	= "IGNORE_FRIEND_REQUEST";
		String username = "usernameA"; //thats the username of client 1
		String request	= command + ' ' + username;
		String expected = "FRIEND_REQUEST_IGNORED " + username;
		
		client2.sendMessage(request);
		
		sleep(1000);
		
		String response = client2.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * User A has added User B - User B has ignored.
	 * Test to see if user b can still see the request
	 */
	@Test
	public void test02q() {
		String command	= "SEE_PENDING_REQUESTS";
		String request	= command;
		String expected = "REQUESTS";//request from A
		
		client2.sendMessage(request);
		
		sleep(1000);
		
		String response = client2.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	
	/**
	 * User A add User D
	 */
	@Test
	public void test02r() {
		String command	= "ADD_FRIEND";
		String username = "usernameD";
		String request	= command + ' ' + username;
		String expected = "FRIEND_REQUEST_SENT "+username;//request from A
		
		client3.sendMessage(request);
		
		sleep(1000);
		
		String response = client3.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}//TODO user D get message
	}
	
	/**
	 * User C has added User D
	 * Test is user D can accept
	 */
	@Test
	public void test02s() {
		String command	= "ACCEPT_FRIEND";
		String username = "usernameC";
		String request	= command + ' ' + username;
		String expected = "FRIEND_REQUEST_ACCEPTED "+username;//request from A
		
		client3.sendMessage(request);
		
		sleep(1000);
		
		String response = client3.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is server responds correctly to a see friends list request
	 * 
	 * In this test no friends have been added so the list returned should be empty
	 */
	@Test
	public void test02t() {
		String command	= "SEE_FRIENDS";
		String request	= command;
		String expected = "FRIENDS UsernameD";//username D is friend at this point
		
		client3.sendMessage(request);
		
		sleep(1000);
		
		String response = client3.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
	/**
	 * Test is a user can delete another as a friend
	 */
	@Test
	public void test02u() {
		String command	= "DELETE_FRIEND";
		String username = "usernameD"; //thats the username of client 2
		String request	= command + ' ' + username;
		String expected = "FRIEND_DELETED " + username;
		
		client3.sendMessage(request);
		
		sleep(1000);
		
		String response = client3.getMessage();
		
		if (!response.equals(expected)) {
			fail("expected response: \""+expected+"\" got :\""+ response+"\"");
		}
	}
	
}
