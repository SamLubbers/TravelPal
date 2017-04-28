

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.ArrayList;

/**
 * @author Robert Cobb <br>
 * Bath University<br>
 * Email: rbc31@bath.ac.uk
 *
 */
public class Client {

	/**
	 * Server ip address
	 */
	private String server;
	
	/**
	 * Server port
	 */
	private int	   port;
	
	/**
	 * Server socket
	 */
	private Socket 			socket;
	
	/**
	 * BufferedReader to read from server
	 */
	private BufferedReader 	in;
	
	/**
	 * Print writer to write to server
	 */
	private PrintWriter 	out;
	
	/**
	 * Username of client
	 */
	private String username;
	
	/**
	 * Holds messages from server
	 */
	private ArrayList<String> messages;
	
	/**
	 * Creates a new client, that will attempted to
	 * connect to the given server client.
	 * @param server
	 * @param port
	 */
	public Client (String server, int port) {
		this.server = server;
		this.port = port;
		this.messages = new ArrayList<String>();
	}
	
	/**
	 * Attempts to connect the server
	 * @throws UnknownHostException
	 * @throws IOException
	 */
	public void connect() throws UnknownHostException, IOException {
		socket = new Socket(server,port);
		in     = new BufferedReader(new InputStreamReader(socket.getInputStream()));
		out    = new PrintWriter(socket.getOutputStream(),true);
		new SocketListner(in,messages).start();
	}
	
	/**
	 * Logins
	 * @param username - username to login in as - will be stored
	 * @param password - password to login in with
	 */
	public void login(String username,String password) {
		this.username = username;
		out.println("LOGIN "+username+ " "+password);
	}
	
	/**
	 * Gets the next message
	 * @return - the message
	 */
	public synchronized String getMessage() {
		return messages.get(0);
	}
	
	/**
	 * Sends the given message
	 * @param message
	 */
	public void sendMessage(String message) {
		out.println(message);
	}
	
	/**
	 * Gets the username of the client
	 * @return - the username
	 */
	public String getUsername() {
		return username;
	}
	
	private static class SocketListner extends Thread {
		
		private BufferedReader in;
		private ArrayList<String> messages;
		
		private SocketListner(BufferedReader in, ArrayList<String> messages) {
			this.in = in;
			this.messages = messages;
		}
		
		public synchronized void run() {
			while (true) {
				try {
					messages.add(in.readLine());
				} catch (IOException e) {
					System.out.println("Exception occurred when reading from server.");
					System.exit(-1);
				}
			}
		}
	}
	
	public static Client getNewClientAndConnect(String address, int port) {
		Client temp = new Client(address,port);
		
		try {
			temp.connect();
		} catch (Exception e) {
			throw new NullPointerException("suffered Exception "+e.getMessage());
		}
		return temp;
	}
}
