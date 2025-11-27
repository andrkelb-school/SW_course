def main():
    import sys
    data = sys.stdin.read().strip().split()
    if len(data) != 2:
        raise ValueError("Erwarte genau zwei Zahlen")
    a, b = map(int, data)
    print(a + b)

if __name__ == "__main__":
    main()
