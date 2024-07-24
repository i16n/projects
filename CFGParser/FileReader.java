package comprehensive;

import java.io.BufferedReader;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * ___
 * 
 * @author David Perry and Isaac Huntsman
 * @version July __, 2024
 */
public class FileReader {

	public HashMap<String, List<List<String>>> parseGrammarFile(String filePath) {

		File file = new File(filePath);

		HashMap<String, List<List<String>>> map = new HashMap<>();


		try (BufferedReader br = new BufferedReader(new java.io.FileReader(file))) {
			String line;

			while ((line = br.readLine()) != null) {

				// parse whole block -> K: category name V: list of possible options
				// The whole line for a block of grammar will just be '{', nothing else
				if (line.equals("{")) {

					String key = br.readLine();
					List<List<String>> arr = new ArrayList<>();

					// Go until the block of the object is over
					//read within while loop conditional
					while (!(line = br.readLine()).equals("}")) {

						List<String> definitions = new ArrayList<>();

						helperTest(line,definitions);
						

						arr.add(definitions);

					}

					// Store the object type and array of its definitions in the map
					map.put(key, arr);
				}
			} //end of while loop

		} catch (Exception e) {
			System.out.println("FNF");
		}

		return map;
	} // end of main
	
	private void helperTest(String line, List<String> definitions) {
		
		while (line.length() > 0) {
			int indexOfNT = line.indexOf('<');
			int endIndexOfNT = line.indexOf('>')+1;

			if (indexOfNT==-1) {
				definitions.add(line);
				//don't change line, just exit. (No NTs on this line)
				break;
			}
			// an NT and a terminal
			else if (indexOfNT==0) {

				definitions.add(line.substring(0, endIndexOfNT));
				// shift right, inclusive
				line = line.substring(endIndexOfNT); 
			}
			// 2 NTs
			else {
				definitions.add(line.substring(0, indexOfNT));
				// shift right inclusive
				line = line.substring(indexOfNT); 
			}
		}
	}

}

