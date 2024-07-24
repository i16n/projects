package comprehensive;

import java.util.HashMap;
import java.util.List;
import java.util.Random;

/**
 * 
 * @author David Perry and Isaac Huntsman
 * @version July __, 2024
 */
public class RandomPhraseGenerator {

	// The private backing array that stores the grammar, found calling the
	// parseGrammar method from the FileReader class
	private HashMap<String, List<List<String>>> grammar;
	private Random random;

	// Initializes the object, to be used to print the random grammar
	public RandomPhraseGenerator(HashMap<String, List<List<String>>> grammar) {

		this.grammar = grammar;
		this.random = new Random();
	}

	public StringBuilder generatePhrase(String object, StringBuilder line) {

		// O(1)
		List<List<String>> definitions = grammar.get(object);

		// O(1)
		List<String> randomDefinition = definitions.get(random.nextInt(definitions.size()));

		// O(N), N: # elements in randomDefinition List
		for (String word : randomDefinition) {

			// recursively call loop again if nonterminal is hit
			if (word.charAt(0) == '<')
				generatePhrase(word, line);
			else
				line.append(word);
		}
		return line;
	}

	// Main method, gets the file name and number of repeats
	public static void main(String[] args) {

		String fileName = args[0];
		int repeat = Integer.parseInt(args[1]);

		// New FileReader Object that will return the hash map we made
		FileReader fileReader = new FileReader();
		
		//O(N) or O(N)^2, N: # distinct elements in .g file?
		HashMap<String, List<List<String>>> grammar = fileReader.parseGrammarFile(fileName);

		// New RandomNumberPhrase generator that will print the random phrases
		RandomPhraseGenerator generator = new RandomPhraseGenerator(grammar);
		
		//O(N), n: # repeats
		for (int i = 0; i < repeat; i++) {

			StringBuilder phrase = new StringBuilder();
			generator.generatePhrase("<start>", phrase);
			
			System.out.println(phrase.toString());
		}
	}
}

