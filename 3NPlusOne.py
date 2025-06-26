# code written by Isaac Huntsman

# ###=== what it is ===###
# a tiny command line app for visualizing the Collatz Conjecture
# displays a graph showing the values reached by running the simple
# set of rules on a given input number, also shows:
# highest value reached
# number of computations before reaching the number 1
# later features:
# - remove comment toggle
# - add a shortcut version option
# - integrate iterative/recursive and shortcut/regular toggles to cli. -- do them per-session
# add information showing how many iterations until we reached a number less than the input

import subprocess

print("input a number to see what it's \"3N+1\" graph looks like \n")

# a subprocess acts like a terminal command, so we call youplot and give it some params
def plot_from_tuples(data):

    # convert the data array into a csv format
    csv_data = "x,y\n" + "\n".join(f"{x},{y}" for x, y in data)

    process = subprocess.Popen(['youplot', 'line', '--width', '100', '--height', '50'], stdin=subprocess.PIPE)
    process.communicate(input=csv_data.encode())



# recursive version of 3N+1
def threeNPlusOne(n, xPlot, data, maxVal):

    data.append((n,xPlot))
    
    maxVal = max(maxVal, n)

    # base case
    if (n == 1): return data, maxVal

    if n % 2 == 0:
        return threeNPlusOne(n // 2, xPlot + 1, data, maxVal)
    else:
        return threeNPlusOne((3 * n + 1) // 2, xPlot + 1, data, maxVal)

# iterative version of 3N+1
def threeNPlusOneIter(n):
    global numCycles, maxVal, dataOut

    while (n != 1):
        if (n > maxVal):
            maxVal = n

        dataOut.append((n,numCycles))
        numCycles += 1

        if (n % 2 == 0):
            n //= 2 # Integer division... important.
        else:
            n = (3*n+1)



# main loop
while True:
    n = input("input a number to run 3n+1 on: ")
    try:
        number = int(n)  # Convert the input to an integer

        dataOut = []

        # switch between iterative and recursive with comment
        # dataOut, maxVal = threeNPlusOne(number, 1, dataOut, 0)

        # uncomment the 3 lines below to turn on iterative version, and comment out recursive version call
        numCycles = 0
        maxVal = 0
        threeNPlusOneIter(number)

        # plot it using a subprocess
        plot_from_tuples(dataOut)

        # print other useful information
        print(f"Max value reached: {maxVal}")
        print(f"Number of computations: {numCycles}")
    except ValueError:
        print("That's not a valid integer!")
