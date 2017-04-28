package tests;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class ConsoleDebugger {

	private static Socket 			soc;
	private static BufferedReader 	in;
	private static PrintWriter 		out;
	
	/**
	 * Attempts to set up a connection to server by getting 
	 * IP address and port of server to connect to from the user.<br>
	 * The socket created is placed in the {@value #soc} socket. <br>
	 * As well as sets up a BufferedReader and PrintWriter to read 
	 * and write to the socket in the {@value # in} {@value #out}
	 * variables<br>
	 * @return True if connection successful, false otherwise
	 */
	private static boolean setup() {
		BufferedReader console = new BufferedReader(new InputStreamReader(System.in));
		
		System.out.print("Enter IP Address: ");
		try {
			String ip   = console.readLine();
			System.out.print("Enter Port: ");
			int    port = Integer.parseInt(console.readLine());
			
			soc  = new Socket(ip,port);
			in   = new BufferedReader(new InputStreamReader(soc.getInputStream()));
			out  = new PrintWriter(soc.getOutputStream(),true);
			return true;
		} catch (Exception e) {
			System.out.print("Failed to connect to port due to "+e.getMessage() + "\nExiting");
			return false;
		}
	}
	
	public static void main(String[] args) {
		 if (setup()) {
			new SocketListner(in).start();
			BufferedReader console = new BufferedReader(new InputStreamReader(System.in));
			
			while (true) {
				String userStr;
				
				//read user input
				try {
					userStr = console.readLine();
				} catch (IOException e) {
					System.out.println("IOException encountered when reading from console - exiting");
					return;
				}
				
				if (userStr.equalsIgnoreCase("quit")) {//quit
					System.out.println("User quiting - exiting program");
					return;
				}else {
					out.println(userStr);
				}
			}
		 }
	}

	
	
	private static class SocketListner extends Thread {
		private BufferedReader 	in;

		
		public SocketListner (BufferedReader in) {
			this.in = in;
		}
		
		
		@Override
		public void run() {
			while (true) {
				try {
					System.out.println(in.readLine());
				} catch (IOException e) {
					System.out.println("IOException occured when reading from socket. - exiting");
					System.exit(-1);
				}
			}
		}
	}
}
